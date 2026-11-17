import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    customer: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      email: { type: String, trim: true, lowercase: true },
    },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', default: null },
    catalogItem: { type: mongoose.Schema.Types.ObjectId, ref: 'CatalogItem', default: null },
    partDetails: { type: String, required: true, trim: true },
    oemNumber: { type: String, trim: true },
    status: { type: String, enum: ['new', 'quoted', 'closed'], default: 'new', index: true },
  },
  { collection: 'inquiries', timestamps: true }
);

export default mongoose.model('Inquiry', inquirySchema);
