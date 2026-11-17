import mongoose from 'mongoose';

const featureSchema = new mongoose.Schema(
  {
    order: { type: Number, default: 0 },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
  },
  { collection: 'features', timestamps: true }
);

export default mongoose.model('Feature', featureSchema);
