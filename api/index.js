import app from '../server/app.js';
import { connectDB } from '../server/config/db.js';

export default async function handler(req, res) {
  try {
    const requestUrl = new URL(req.url, 'http://localhost');
    const apiPath = requestUrl.searchParams.get('path');

    if (apiPath) {
      requestUrl.searchParams.delete('path');
      const query = requestUrl.searchParams.toString();
      req.url = `/api/${apiPath}${query ? `?${query}` : ''}`;
    }

    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('API request failed:', error);
    return res.status(503).json({ error: 'Service temporarily unavailable' });
  }
}
