import mongoose from 'mongoose';

const heroSectionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    breadcrumb: { type: String, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    imageUrl: { type: String, trim: true },
    imageAlt: { type: String, trim: true },
    ctaLabel: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { collection: 'heroSections', timestamps: true }
);

export default mongoose.model('HeroSection', heroSectionSchema);
