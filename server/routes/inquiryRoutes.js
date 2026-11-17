import { Router } from 'express';
import { createInquiry, getInquiries } from '../controllers/inquiryController.js';

const router = Router();
router.get('/inquiries', getInquiries);
router.post('/inquiries', createInquiry);
export default router;
