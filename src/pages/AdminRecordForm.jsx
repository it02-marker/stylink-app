import React from 'react';

function getValueAtPath(object, path) {
  return path.split('.').reduce((value, part) => value?.[part], object);
}

function setValueAtPath(object, path, nextValue) {
  const [part, ...remaining] = path.split('.');
  if (!remaining.length) return { ...object, [part]: nextValue };
  return {
    ...object,
    [part]: setValueAtPath(object?.[part] || {}, remaining.join('.'), nextValue),
  };
}

function emptyFieldValue(field) {
  if (field.kind === 'Array') return [];
  if (field.kind === 'Boolean') return false;
  if (field.kind === 'Number') return '';
  return '';
}

function inputClass() {
  return 'admin-input mt-1';
}

function isLongTextField(path) {
  return /description|quote|mission|vision|partdetails|street/i.test(path);
}

function ReferenceInput({ value, options, onChange, required }) {
  const selectedValue = value ? String(value) : '';
  const hasSelectedOption = options.some((option) => option.value === selectedValue);
  return (
    <select
      value={selectedValue}
      required={required}
      onChange={(event) => onChange(event.target.value || null)}
      className={inputClass()}
    >
      <option value="">{required ? 'Select a record' : 'Not set'}</option>
      {!hasSelectedOption && selectedValue && <option value={selectedValue}>Selected record (unavailable)</option>}
      {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
  );
}

function ScalarControl({ field, value, onChange, references, required = field.required }) {
  if (field.kind === 'Boolean') {
    return (
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
          className="h-4 w-4 accent-orange-600"
        />
        {field.label}
      </label>
    );
  }

  if (field.enumValues?.length) {
    return (
      <select value={value ?? ''} required={required} onChange={(event) => onChange(event.target.value)} className={inputClass()}>
        {!required && <option value="">Not set</option>}
        {field.enumValues.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    );
  }

  if (field.kind === 'ObjectId' || field.kind === 'ObjectID') {
    return (
      <ReferenceInput
        value={value}
        options={references[field.ref] || []}
        onChange={onChange}
        required={required}
      />
    );
  }

  if (field.kind === 'Number') {
    return (
      <input
        type="number"
        value={value ?? ''}
        required={required}
        min={field.min}
        max={field.max}
        onChange={(event) => onChange(event.target.value === '' ? null : Number(event.target.value))}
        className={inputClass()}
      />
    );
  }

  const isLongText = isLongTextField(field.path);
  if (isLongText) {
    return (
      <textarea
        value={value ?? ''}
        required={required}
        rows={3}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass()}
      />
    );
  }

  return (
    <input
      type="text"
      value={value ?? ''}
      required={required}
      minLength={field.minLength}
      maxLength={field.maxLength}
      onChange={(event) => onChange(event.target.value)}
      className={inputClass()}
    />
  );
}

function ArrayField({ field, value, onChange, references }) {
  const items = Array.isArray(value) ? value : [];
  if (field.itemRef) {
    const options = references[field.itemRef] || [];
    return (
      <label className="block text-sm font-medium text-slate-700">
        {field.label}
        <select
          multiple
          value={items.map((item) => String(item))}
          onChange={(event) => onChange(Array.from(event.target.selectedOptions, (option) => option.value))}
          className={`${inputClass()} min-h-32`}
        >
          {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <span className="mt-1 block text-xs font-normal text-slate-500">Use Ctrl or Command to select multiple records.</span>
      </label>
    );
  }

  const itemField = {
    path: `${field.path}[]`,
    label: field.label,
    kind: field.itemKind,
    ref: field.itemRef,
    enumValues: field.itemEnumValues,
    required: false,
  };

  function updateItem(index, nextValue) {
    onChange(items.map((item, current) => current === index ? nextValue : item));
  }

  function addItem() {
    const newValue = field.itemFields?.length
      ? Object.fromEntries(field.itemFields.map((subField) => [subField.path, emptyFieldValue(subField)]))
      : emptyFieldValue(itemField);
    onChange([...items, newValue]);
  }

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium text-slate-700">{field.label}</legend>
      {items.map((item, index) => (
        <div key={`${field.path}-${index}`} className="border border-slate-200 bg-slate-50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Item {index + 1}</span>
            <button type="button" onClick={() => onChange(items.filter((_, current) => current !== index))} className="text-xs font-semibold text-red-700 hover:underline">
              Remove
            </button>
          </div>
          {field.itemFields?.length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {field.itemFields.map((subField) => (
                <label key={subField.path} className="block text-xs font-medium text-slate-600">
                  {subField.label}
                  <ScalarControl
                    field={subField}
                    value={getValueAtPath(item, subField.path)}
                    required={subField.required}
                    references={references}
                    onChange={(nextValue) => updateItem(index, setValueAtPath(item, subField.path, nextValue))}
                  />
                </label>
              ))}
            </div>
          ) : (
            <ScalarControl
              field={itemField}
              value={item}
              references={references}
              onChange={(nextValue) => updateItem(index, nextValue)}
            />
          )}
        </div>
      ))}
      <button type="button" onClick={addItem} className="border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
        Add {field.label.toLowerCase()}
      </button>
    </fieldset>
  );
}

export default function AdminRecordForm({ fields, references, value, onChange }) {
  function updateField(field, nextValue) {
    onChange(setValueAtPath(value, field.path, nextValue));
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((field) => {
        const fieldValue = getValueAtPath(value, field.path);
        if (field.kind === 'Array') {
          return (
            <div key={field.path} className="sm:col-span-2">
              <ArrayField
                field={field}
                value={fieldValue}
                references={references}
                onChange={(nextValue) => updateField(field, nextValue)}
              />
            </div>
          );
        }

        if (field.kind === 'Boolean') {
          return (
            <div key={field.path} className="flex items-end">
              <ScalarControl
                field={field}
                value={fieldValue}
                references={references}
                onChange={(nextValue) => updateField(field, nextValue)}
              />
            </div>
          );
        }

        return (
          <label
            key={field.path}
            className={`block text-sm font-medium text-slate-700 ${isLongTextField(field.path) ? 'sm:col-span-2' : ''}`}
          >
            {field.label}{field.required ? ' *' : ''}
            <ScalarControl
              field={field}
              value={fieldValue}
              references={references}
              onChange={(nextValue) => updateField(field, nextValue)}
            />
          </label>
        );
      })}
    </div>
  );
}
