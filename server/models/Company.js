import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    slug: { type: String, default: 'stylink-zw', unique: true },
    subtitle: { type: String, required: true },
    title: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    mission: { type: String, required: true },
    vision: { type: String, required: true },
    values: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        icon: { type: String, required: true },
      },
    ],
    contact: {
      primaryPhone: String,
      primaryTel: String,
      whatsappUrl: String,
      youtubeUrl: String,
      logoUrl: String,
      footerBgUrl: String,
    },
    navigation: [
      {
        label: String,
        path: String,
        order: Number,
      },
    ],
    socials: [
      {
        name: String,
        href: String,
        icon: String,
        hoverClass: String,
      },
    ],
  },
  { collection: 'company', timestamps: true }
);

export default mongoose.model('Company', companySchema);
