import app from '../server/app.js';
import { connectDB } from '../server/config/db.js';

export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('API request failed:', error);
    return res.status(503).json({ error: 'Service temporarily unavailable' });
  }
}
