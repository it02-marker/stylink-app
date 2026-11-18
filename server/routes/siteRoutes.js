import { Router } from 'express';
import {
  getBrands,
  getBranches,
  getSlides,
  getHeroSections,
  getFeatures,
  getTestimonials,
  getCompany,
} from '../controllers/siteController.js';

const router = Router();
router.get('/brands', getBrands);
router.get('/branches', getBranches);
router.get('/slides', getSlides);
router.get('/hero-sections', getHeroSections);
router.get('/features', getFeatures);
router.get('/testimonials', getTestimonials);
router.get('/company', getCompany);
export default router;
