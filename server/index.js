import 'dotenv/config';
import { createApp } from './app.js';
import { connectDb } from './config/db.js';

const PORT = Number(process.env.PORT) || 5000;
createApp().listen(PORT, () => console.log(`[api] Digital Detective API listening on http://localhost:${PORT}`));

// The API starts even if MongoDB is unreachable (it answers 503 until the database is connected).
async function connect() {
  try { await connectDb(); console.log('[db] MongoDB connected'); }
  catch (err) {
    console.error('[db] MongoDB connection failed:', err.message);
    if (process.env.MONGODB_URI) { console.error('[db] retrying in 10s...'); setTimeout(connect, 10000); }
    else console.error('[db] Create a .env file (see .env.example) and set MONGODB_URI, then restart `npm run server`.');
  }
}
connect();
