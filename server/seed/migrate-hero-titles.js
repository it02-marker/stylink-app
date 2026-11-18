import mongoose from 'mongoose';
import dotenv from 'dotenv';
import HeroSection from '../models/HeroSection.js';

dotenv.config({ path: './server/.env' });

try {
  await mongoose.connect(process.env.MONGODB_URI);
  const result = await HeroSection.collection.updateMany(
    { highlight: { $exists: true } },
    [
      {
        $set: {
          title: {
            $trim: {
              input: {
                $concat: [
                  { $ifNull: ['$title', ''] },
                  ' ',
                  { $ifNull: ['$highlight', ''] },
                ],
              },
            },
          },
        },
      },
      { $unset: 'highlight' },
    ]
  );
  console.log(`Merged titles for ${result.modifiedCount} hero sections.`);
} catch (error) {
  console.error('Hero title migration failed:', error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
