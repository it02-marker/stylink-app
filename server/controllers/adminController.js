import mongoose from 'mongoose';
import Branch from '../models/Branch.js';
import Brand from '../models/Brand.js';
import CatalogItem from '../models/CatalogItem.js';
import Category from '../models/Category.js';

const MAX_PRODUCTS_PER_PAGE = 100;

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function serializeProduct(item) {
  return {
    _id: item._id,
    slug: item.slug,
    name: item.name,
    brandCode: item.brandCode,
    brand: item.brand,
    categorySlug: item.categorySlug,
    category: item.category,
    oemNumbers: item.oemNumbers,
    compatibility: item.compatibility,
    stock: item.stock,
    image: item.image,
    description: item.description,
    createdAt: item.createdAt,
  };
}

export async function getAdminOptions(req, res) {
  try {
    const [brands, categories, branches] = await Promise.all([
      Brand.find({ showInCatalog: { $ne: false } }).select('_id code name').sort({ name: 1 }),
      Category.find().select('_id slug label').sort({ order: 1 }),
      Branch.find({ isActive: true }).select('_id name').sort({ name: 1 }),
    ]);

    return res.json({ brands, categories, branches });
  } catch (error) {
    console.error('Failed to load admin product options:', error);
    return res.status(500).json({ error: 'Could not load product options' });
  }
}

export async function listAdminProducts(req, res) {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search.trim().slice(0, 100) : '';
    const query = search
      ? {
          $or: [
            { name: new RegExp(escapeRegex(search), 'i') },
            { slug: new RegExp(escapeRegex(search), 'i') },
            { brandCode: new RegExp(escapeRegex(search), 'i') },
            { oemNumbers: new RegExp(escapeRegex(search), 'i') },
          ],
        }
      : {};

    const products = await CatalogItem.find(query)
      .sort({ createdAt: -1 })
      .limit(MAX_PRODUCTS_PER_PAGE)
      .populate('brand', 'name code')
      .populate('category', 'slug label')
      .populate('stock.availableBranches', 'name');

    return res.json(products.map(serializeProduct));
  } catch (error) {
    console.error('Failed to load admin products:', error);
    return res.status(500).json({ error: 'Could not load products' });
  }
}

function text(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100);
}

function validationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

export async function createAdminProduct(req, res) {
  try {
    const body = req.body ?? {};
    const name = text(body.name, 160);
    const slug = slugify(text(body.slug, 120) || name);
    const brandId = text(body.brandId, 50);
    const categoryId = text(body.categoryId, 50);
    const compatibility = text(body.compatibility, 500);
    const image = text(body.image, 2048);
    const description = text(body.description, 3000);
    const statusLabel = text(body.statusLabel, 120);
    const inStock = body.inStock === true;
    const oemNumbers = Array.isArray(body.oemNumbers)
      ? body.oemNumbers.map((value) => text(value, 80)).filter(Boolean).slice(0, 30)
      : [];
    const branchIds = Array.isArray(body.branchIds)
      ? [...new Set(body.branchIds.map((value) => text(value, 50)))]
      : [];

    if (!name || !slug || !brandId || !categoryId || !compatibility || !image || !description || !statusLabel) {
      throw validationError('Complete all required product fields');
    }
    if (!mongoose.isValidObjectId(brandId) || !mongoose.isValidObjectId(categoryId)) {
      throw validationError('Choose a valid brand and category');
    }
    if (branchIds.some((id) => !mongoose.isValidObjectId(id))) {
      throw validationError('Choose valid branches');
    }

    try {
      const imageUrl = new URL(image);
      if (!['http:', 'https:'].includes(imageUrl.protocol)) {
        throw validationError('Image must use an http or https URL');
      }
    } catch (error) {
      if (error.statusCode) throw error;
      throw validationError('Enter a valid image URL');
    }

    const [brand, category, branches, existingProduct] = await Promise.all([
      Brand.findById(brandId).select('_id code'),
      Category.findById(categoryId).select('_id slug'),
      branchIds.length ? Branch.find({ _id: { $in: branchIds }, isActive: true }).select('_id') : [],
      CatalogItem.findOne({ slug }).select('_id'),
    ]);

    if (!brand || !category) throw validationError('The selected brand or category no longer exists');
    if (branches.length !== branchIds.length) throw validationError('One or more selected branches are unavailable');
    if (existingProduct) return res.status(409).json({ error: 'A product with this slug already exists' });

    const product = await CatalogItem.create({
      slug,
      name,
      brand: brand._id,
      brandCode: brand.code,
      category: category._id,
      categorySlug: category.slug,
      oemNumbers,
      compatibility,
      stock: {
        inStock,
        statusLabel,
        availableBranches: branchIds,
      },
      image,
      description,
    });

    await product.populate([
      { path: 'brand', select: 'name code' },
      { path: 'category', select: 'slug label' },
      { path: 'stock.availableBranches', select: 'name' },
    ]);

    return res.status(201).json(serializeProduct(product));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'A product with this slug already exists' });
    }
    if (error.name === 'ValidationError' || error.statusCode === 400) {
      return res.status(400).json({ error: error.message });
    }
    console.error('Failed to create catalog product:', error);
    return res.status(500).json({ error: 'Could not create product' });
  }
}
