import mongoose from 'mongoose';

let connectionPromise;

export async function connectDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is required');
  }

  if (mongoose.connection.readyState === 1) return mongoose.connection;

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGODB_URI).catch((err) => {
      connectionPromise = undefined;
      throw err;
    });
  }

  return connectionPromise;
}
