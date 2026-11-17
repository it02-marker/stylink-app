import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true }, // e.g. 'HINO'
    name: { type: String, required: true, trim: true }, // e.g. 'Hino'
    alt: { type: String, required: true },
    logoUrl: { type: String, required: true },
    showInMarquee: { type: Boolean, default: true },
    showInCatalog: { type: Boolean, default: true },
    featuredCard: {
      isFeatured: { type: Boolean, default: false },
      order: { type: Number, default: 0 },
      image: { type: String },
      imageAlt: { type: String },
      tagline: { type: String },
    },
  },
  { collection: 'brands', timestamps: true }
);

export default mongoose.model('Brand', brandSchema);
