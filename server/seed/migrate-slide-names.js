import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Slide from '../models/Slide.js';
import { heroSlides } from './data/slides.js';

dotenv.config({ path: './server/.env' });

try {
  await mongoose.connect(process.env.MONGODB_URI);
  const results = await Promise.all(
    heroSlides.map((slide) => Slide.updateOne(
      { order: slide.id, $or: [{ name: { $exists: false } }, { name: '' }] },
      { $set: { name: slide.name } }
    ))
  );
  const updated = results.reduce((count, result) => count + result.modifiedCount, 0);
  const matched = results.reduce((count, result) => count + result.matchedCount, 0);
  console.log(`Slide names ready: ${matched} matched, ${updated} added.`);
} catch (error) {
  console.error('Slide name migration failed:', error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
