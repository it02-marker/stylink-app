import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    author: { type: String, required: true, trim: true },
    role: { type: String, required: true },
    location: { type: String, required: true },
    avatar: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    quote: { type: String, required: true },
    isApproved: { type: Boolean, default: true },
  },
  { collection: 'testimonials', timestamps: true }
);

export default mongoose.model('Testimonial', testimonialSchema);
