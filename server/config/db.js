import mongoose from 'mongoose';

mongoose.set('strictQuery', true);
mongoose.set('bufferCommands', false); // fail fast instead of hanging when the database is down

export const isDbReady = () => mongoose.connection.readyState === 1;

export async function connectDb(uri = process.env.MONGODB_URI) {
  if (!uri) throw new Error('MONGODB_URI is not set. Copy .env.example to .env and put your MongoDB connection string there.');
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  return mongoose.connection;
}
export const disconnectDb = () => mongoose.disconnect();
