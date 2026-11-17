import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    address: {
      street: { type: String, required: true },
      suburb: { type: String },
      city: { type: String, required: true },
      lines: [{ type: String, required: true }],
    },
    phone: { type: String, required: true },
    telLink: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { collection: 'branches', timestamps: true }
);

export default mongoose.model('Branch', branchSchema);
