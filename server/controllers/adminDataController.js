import Branch from '../models/Branch.js';
import Brand from '../models/Brand.js';
import CatalogItem from '../models/CatalogItem.js';
import Category from '../models/Category.js';
import Company from '../models/Company.js';
import Feature from '../models/Feature.js';
import Inquiry from '../models/Inquiry.js';
import HeroSection from '../models/HeroSection.js';
import Slide from '../models/Slide.js';
import Testimonial from '../models/Testimonial.js';

const RESOURCES = {
  products: { label: 'Products', model: CatalogItem },
  brands: { label: 'Brands', model: Brand },
  categories: { label: 'Categories', model: Category },
  branches: { label: 'Branches', model: Branch },
  slides: { label: 'Slides', model: Slide },
  heroSections: { label: 'Hero sections', model: HeroSection },
  features: { label: 'Features', model: Feature },
  testimonials: { label: 'Testimonials', model: Testimonial },
  company: { label: 'Company settings', model: Company },
  inquiries: { label: 'Customer inquiries', model: Inquiry },
};
const REFERENCE_MODELS = {
  Brand,
  Category,
  Branch,
  CatalogItem,
};

const PAGE_SIZE = 50;
const LIST_PAGE_SIZE = 100;
const MAX_BULK_INSERT_SIZE = 50;
const RESERVED_FIELDS = new Set(['_id', '__v', 'createdAt', 'updatedAt']);

function getResource(key) {
  const resource = RESOURCES[key];
  if (!resource) {
    const error = new Error('Unknown database collection');
    error.statusCode = 404;
    throw error;
  }
  return resource;
}

function describeField(path, schemaType) {
  const descriptor = {
    path,
    label: path.split('.').map((part) => part.replace(/([a-z])([A-Z])/g, '$1 $2')).join(' / '),
    kind: schemaType.instance,
    required: schemaType.isRequired === true,
    enumValues: schemaType.enumValues?.length ? schemaType.enumValues : undefined,
    ref: schemaType.options?.ref,
    min: schemaType.options?.min,
    max: schemaType.options?.max,
    minLength: schemaType.options?.minlength,
    maxLength: schemaType.options?.maxlength,
  };

  if (schemaType.instance === 'Array') {
    const itemType = schemaType.embeddedSchemaType;
    descriptor.kind = 'Array';
    descriptor.itemKind = itemType?.instance || 'Mixed';
    descriptor.itemRef = itemType?.options?.ref;
    descriptor.itemEnumValues = itemType?.enumValues?.length ? itemType.enumValues : undefined;
    descriptor.itemMin = itemType?.options?.min;
    descriptor.itemMax = itemType?.options?.max;
    descriptor.itemMinLength = itemType?.options?.minlength;
    descriptor.itemMaxLength = itemType?.options?.maxlength;
    descriptor.itemFields = schemaType.schema
      ? Object.entries(schemaType.schema.paths)
        .filter(([fieldPath]) => !RESERVED_FIELDS.has(fieldPath))
        .map(([fieldPath, fieldType]) => describeField(fieldPath, fieldType))
      : undefined;
  }

  return descriptor;
}

async function getReferenceOptions(fields) {
  const references = [...new Set(fields.flatMap((field) => [
    field.ref,
    field.itemRef,
    ...(field.itemFields || []).map((item) => item.ref),
  ]).filter(Boolean))];

  const entries = await Promise.all(references.map(async (reference) => {
    const Model = REFERENCE_MODELS[reference];
    if (!Model) return [reference, []];

    const records = await Model.find()
      .select('_id name label title author slug code customer')
      .sort({ name: 1, _id: 1 })
      .limit(500)
      .lean();
    return [reference, records.map((record) => ({
      value: String(record._id),
      label: record.name
        ? `${record.name}${record.code ? ` (${record.code})` : ''}`
        : record.label
        || record.title
        || record.author
        || record.customer?.name
        || record.slug
        || record.code
        || String(record._id),
    }))];
  }));

  return Object.fromEntries(entries);
}

function normalizeExtendedJson(value) {
  if (Array.isArray(value)) return value.map(normalizeExtendedJson);
  if (!value || typeof value !== 'object') return value;

  const keys = Object.keys(value);
  if (keys.length === 1 && typeof value.$oid === 'string') return value.$oid;

  return Object.fromEntries(
    Object.entries(value).map(([key, child]) => [key, normalizeExtendedJson(child)])
  );
}

function setDocumentValue(document, path, value) {
  const parts = path.split('.');
  let current = document;
  for (const part of parts.slice(0, -1)) {
    if (!current[part] || typeof current[part] !== 'object' || Array.isArray(current[part])) {
      current[part] = {};
    }
    current = current[part];
  }
  current[parts.at(-1)] = value;
}

function parseDocument(body, model) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    const error = new Error('Record must be a JSON object');
    error.statusCode = 400;
    throw error;
  }

  const normalizedBody = normalizeExtendedJson(body);
  for (const [path, schemaType] of Object.entries(model.schema.paths)) {
    if (schemaType.instance !== 'Array') continue;
    const value = getDocumentValue(normalizedBody, path);
    if (!value.exists || typeof value.value !== 'string') continue;

    let parsed;
    try {
      parsed = JSON.parse(value.value);
    } catch {
      parsed = null;
    }
    if (!Array.isArray(parsed)) {
      const error = new Error(`${path} must be a JSON array`);
      error.statusCode = 400;
      throw error;
    }
    setDocumentValue(normalizedBody, path, normalizeExtendedJson(parsed));
  }

  const schemaFields = new Set(
    Object.keys(model.schema.paths)
      .filter((path) => !RESERVED_FIELDS.has(path))
      .map((path) => path.split('.')[0])
  );
  const unknownFields = Object.keys(normalizedBody).filter(
    (field) => !RESERVED_FIELDS.has(field) && !schemaFields.has(field)
  );
  if (unknownFields.length) {
    const error = new Error(`Unknown field${unknownFields.length === 1 ? '' : 's'}: ${unknownFields.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  return Object.fromEntries(
    Object.entries(normalizedBody).filter(([field]) => !RESERVED_FIELDS.has(field))
  );
}

function getDocumentValue(document, path) {
  let value = document;
  for (const part of path.split('.')) {
    if (!value || typeof value !== 'object' || !Object.hasOwn(value, part)) {
      return { exists: false };
    }
    value = value[part];
  }
  return { exists: true, value };
}

function sendError(res, error, operation) {
  if (error.statusCode) return res.status(error.statusCode).json({ error: error.message });
  if (error.code === 11000) return res.status(409).json({ error: 'A record with these unique values already exists' });
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({ error: error.message });
  }
  console.error(`Admin database ${operation} failed:`, error);
  return res.status(500).json({ error: `Could not ${operation} database record` });
}

export async function listAdminResources(_req, res) {
  try {
    const resources = await Promise.all(
      Object.entries(RESOURCES).map(async ([key, resource]) => ({
        key,
        label: resource.label,
        count: await resource.model.countDocuments(),
      }))
    );
    return res.json(resources);
  } catch (error) {
    return sendError(res, error, 'load');
  }
}

export async function listAdminRecords(req, res) {
  try {
    const { model } = getResource(req.params.resource);
    const requestedPage = Number.parseInt(req.query.page, 10);
    const total = await model.countDocuments();
    const maxPage = Math.max(1, Math.ceil(total / LIST_PAGE_SIZE));
    const page = Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? Math.min(requestedPage, maxPage)
      : 1;
    const items = await model.find()
      .sort({ updatedAt: -1, _id: -1 })
      .skip((page - 1) * LIST_PAGE_SIZE)
      .limit(LIST_PAGE_SIZE)
      .lean();
    return res.json({ items, total, page, pageSize: LIST_PAGE_SIZE });
  } catch (error) {
    return sendError(res, error, 'load');
  }
}

export function getAdminRecordTemplate(req, res) {
  try {
    const { model } = getResource(req.params.resource);
    const template = new model().toObject();
    for (const field of RESERVED_FIELDS) delete template[field];
    return res.json(template);
  } catch (error) {
    return sendError(res, error, 'load');
  }
}

export async function getAdminRecordSchema(req, res) {
  try {
    const { model } = getResource(req.params.resource);
    const fields = Object.entries(model.schema.paths)
      .filter(([path]) => !RESERVED_FIELDS.has(path))
      .map(([path, schemaType]) => describeField(path, schemaType));
    const references = await getReferenceOptions(fields);
    return res.json({ fields, references });
  } catch (error) {
    return sendError(res, error, 'load');
  }
}

export async function createAdminRecord(req, res) {
  try {
    const { model } = getResource(req.params.resource);
    if (Array.isArray(req.body)) {
      if (req.body.length === 0 || req.body.length > MAX_BULK_INSERT_SIZE) {
        return res.status(400).json({ error: `Insert between 1 and ${MAX_BULK_INSERT_SIZE} records at a time` });
      }
      const documents = req.body.map((record) => parseDocument(record, model));
      const created = await model.insertMany(documents);
      return res.status(201).json(created.map((document) => document.toObject()));
    }

    const document = await model.create(parseDocument(req.body, model));
    return res.status(201).json(document.toObject());
  } catch (error) {
    return sendError(res, error, 'create');
  }
}

export async function updateAdminRecord(req, res) {
  try {
    const { model } = getResource(req.params.resource);
    const document = await model.findById(req.params.id);
    if (!document) return res.status(404).json({ error: 'Record not found' });

    const updatedValues = parseDocument(req.body, model);
    for (const path of Object.keys(model.schema.paths)) {
      if (RESERVED_FIELDS.has(path)) continue;
      const value = getDocumentValue(updatedValues, path);
      document.set(path, value.exists ? value.value : undefined);
    }
    await document.save();
    return res.json(document.toObject());
  } catch (error) {
    return sendError(res, error, 'update');
  }
}

export async function deleteAdminRecord(req, res) {
  try {
    const { model } = getResource(req.params.resource);
    const document = await model.findByIdAndDelete(req.params.id);
    if (!document) return res.status(404).json({ error: 'Record not found' });
    return res.json({ deleted: true });
  } catch (error) {
    return sendError(res, error, 'delete');
  }
}

export async function deleteAdminRecords(req, res) {
  try {
    const { model } = getResource(req.params.resource);
    const ids = req.body?.ids;
    if (
      !Array.isArray(ids)
      || ids.length === 0
      || ids.length > PAGE_SIZE
      || ids.some((id) => typeof id !== 'string' || !model.base.isValidObjectId(id))
    ) {
      return res.status(400).json({ error: `Select between 1 and ${PAGE_SIZE} valid records` });
    }

    const result = await model.deleteMany({ _id: { $in: [...new Set(ids)] } });
    return res.json({ deletedCount: result.deletedCount });
  } catch (error) {
    return sendError(res, error, 'delete');
  }
}
