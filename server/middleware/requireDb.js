import { isDbReady } from '../config/db.js';
import { HttpError } from './errors.js';
export const requireDb = (req, res, next) => (isDbReady() ? next() : next(new HttpError(503, 'DATABASE_UNAVAILABLE', 'Case database is unavailable')));
