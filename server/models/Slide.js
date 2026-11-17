import mongoose from 'mongoose';

const slideSchema = new mongoose.Schema(
  {
    order: { type: Number, required: true, unique: true },
    imageUrl: { type: String, required: true },
    alt: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { collection: 'slides', timestamps: true }
);

export default mongoose.model('Slide', slideSchema);
