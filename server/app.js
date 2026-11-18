import express from 'express';
import cors from 'cors';
import catalogRoutes from './routes/catalogRoutes.js';
import siteRoutes from './routes/siteRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok', db: 'stylink' }));
app.use('/api', catalogRoutes);
app.use('/api', siteRoutes);
app.use('/api', inquiryRoutes);
app.use('/api/admin', adminRoutes);

export default app;
