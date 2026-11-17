import { Router } from 'express';
import {
  getFeaturedBrands,
  getCatalogItems,
  getCatalogFilters,
} from '../controllers/catalogController.js';

const router = Router();
router.get('/featured-brands', getFeaturedBrands);
router.get('/catalog', getCatalogItems);
router.get('/catalog/filters', getCatalogFilters);
export default router;
