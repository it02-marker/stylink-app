import Brand from '../models/Brand.js';
import Branch from '../models/Branch.js';
import Slide from '../models/Slide.js';
import Feature from '../models/Feature.js';
import Testimonial from '../models/Testimonial.js';
import Company from '../models/Company.js';

export const getBrands = async (req, res) => {
  res.json(await Brand.find({ showInMarquee: { $ne: false } }).sort({ name: 1 }));
};

export const getBranches = async (req, res) => {
  const branches = await Branch.find({ isActive: true });
  res.json(
    branches.map((b) => ({
      _id: b._id,
      slug: b.slug,
      name: b.name,
      addressLines: b.address.lines,
      address: b.address,
      phone: b.phone,
      telLink: b.telLink,
    }))
  );
};

export const getSlides = async (req, res) => {
  const slides = await Slide.find({ isActive: true }).sort({ order: 1 });
  res.json(slides.map((s) => ({ id: s.order, imageUrl: s.imageUrl, alt: s.alt })));
};

export const getFeatures = async (req, res) => {
  res.json(await Feature.find().sort({ order: 1 }));
};

export const getTestimonials = async (req, res) => {
  res.json(await Testimonial.find({ isApproved: true }));
};

export const getCompany = async (req, res) => {
  res.json(await Company.findOne({ slug: 'stylink-zw' }));
};
