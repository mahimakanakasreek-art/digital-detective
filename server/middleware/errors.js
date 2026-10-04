export class HttpError extends Error {
  constructor(status, code, message, details) { super(message); this.status = status; this.code = code; this.details = details; }
}
export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
export const notFound = (req, res, next) => next(new HttpError(404, 'ROUTE_NOT_FOUND', `No route for ${req.method} ${req.originalUrl}`));
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) return res.status(err.status).json({ error: { code: err.code, message: err.message, ...(err.details ? { details: err.details } : {}) } });
  if (err?.type === 'entity.parse.failed') return res.status(400).json({ error: { code: 'INVALID_JSON', message: 'Request body is not valid JSON' } });
  if (err?.name === 'CastError') return res.status(400).json({ error: { code: 'INVALID_ID', message: 'Invalid identifier' } });
  if (err?.name === 'MongoServerSelectionError' || err?.name === 'MongoNetworkError') return res.status(503).json({ error: { code: 'DATABASE_UNAVAILABLE', message: 'Case database is unavailable' } });
  console.error('[api] unexpected error:', err);
  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Unexpected server error' } });
};
