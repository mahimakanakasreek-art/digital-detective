import express from 'express';
import cors from 'cors';
import { isDbReady } from './config/db.js';
import { requireDb } from './middleware/requireDb.js';
import { notFound, errorHandler } from './middleware/errors.js';
import caseRoutes from './routes/cases.js';
import investigationRoutes from './routes/investigations.js';

export function createApp() {
  const app = express();
  const origins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173').split(',').map((s) => s.trim());
  app.disable('x-powered-by');
  app.use(cors({ origin: origins }));
  app.use(express.json({ limit: '50kb' }));
  app.get('/api/health', (req, res) => res.json({ status: 'ok', database: isDbReady() ? 'connected' : 'disconnected' }));
  app.use('/api/cases', requireDb, caseRoutes);
  app.use('/api/investigations', requireDb, investigationRoutes);
  app.use('/api', notFound);
  app.use(errorHandler);
  return app;
}
