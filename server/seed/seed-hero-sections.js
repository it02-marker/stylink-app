import mongoose from 'mongoose';
import dotenv from 'dotenv';
import HeroSection from '../models/HeroSection.js';
import { heroSections } from './data/hero-sections.js';

dotenv.config({ path: './server/.env' });

try {
  await mongoose.connect(process.env.MONGODB_URI);
  const results = await Promise.all(
    heroSections.map((section) => HeroSection.updateOne(
      { key: section.key },
      { $setOnInsert: section },
      { upsert: true }
    ))
  );
  const inserted = results.filter((result) => result.upsertedCount).length;
  console.log(`Hero sections ready: ${inserted} inserted, ${results.length - inserted} already existed.`);
} catch (error) {
  console.error('Hero section seed failed:', error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
