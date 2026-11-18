import { Router } from 'express';
import {
  createAdminProduct,
  getAdminOptions,
  listAdminProducts,
} from '../controllers/adminController.js';
import {
  createAdminRecord,
  deleteAdminRecord,
  deleteAdminRecords,
  getAdminRecordSchema,
  getAdminRecordTemplate,
  listAdminRecords,
  listAdminResources,
  updateAdminRecord,
} from '../controllers/adminDataController.js';
import {
  loginAdmin,
  logoutAdmin,
  changeAdminPassword,
  requireAdmin,
  requireSameOrigin,
} from '../middleware/adminAuth.js';

const router = Router();

router.use((_req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

router.post('/login', requireSameOrigin, loginAdmin);
router.post('/logout', requireSameOrigin, logoutAdmin);
router.post('/password', requireSameOrigin, requireAdmin, changeAdminPassword);
router.get('/session', requireAdmin, (_req, res) => res.json({ authenticated: true }));
router.get('/options', requireAdmin, getAdminOptions);
router.get('/products', requireAdmin, listAdminProducts);
router.post('/products', requireSameOrigin, requireAdmin, createAdminProduct);
router.get('/resources', requireAdmin, listAdminResources);
router.get('/resources/:resource', requireAdmin, listAdminRecords);
router.get('/resources/:resource/schema', requireAdmin, getAdminRecordSchema);
router.get('/resources/:resource/template', requireAdmin, getAdminRecordTemplate);
router.post('/resources/:resource', requireSameOrigin, requireAdmin, createAdminRecord);
router.put('/resources/:resource/:id', requireSameOrigin, requireAdmin, updateAdminRecord);
router.delete('/resources/:resource', requireSameOrigin, requireAdmin, deleteAdminRecords);
router.delete('/resources/:resource/:id', requireSameOrigin, requireAdmin, deleteAdminRecord);

export default router;
