import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import catalogRoutes from './routes/catalogRoutes.js';
import siteRoutes from './routes/siteRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';

dotenv.config({ path: './server/.env' });

await connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok', db: 'stylink' }));
app.use('/api', catalogRoutes);
app.use('/api', siteRoutes);
app.use('/api', inquiryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
