import mongoose from 'mongoose';

const catalogItemSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true, index: true },
    brandCode: { type: String, required: true, uppercase: true, index: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    categorySlug: { type: String, required: true, lowercase: true, index: true },
    oemNumbers: [{ type: String, trim: true, index: true }],
    compatibility: { type: String, required: true },
    stock: {
      inStock: { type: Boolean, default: true },
      statusLabel: { type: String, required: true },
      availableBranches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Branch' }],
    },
    image: { type: String, required: true },
    description: { type: String, required: true },
  },
  { collection: 'catalog_items', timestamps: true }
);

// Full-text index for fast search across part names, OEM numbers, and truck models
catalogItemSchema.index({
  name: 'text',
  oemNumbers: 'text',
  compatibility: 'text',
  description: 'text',
});

export default mongoose.model('CatalogItem', catalogItemSchema);
