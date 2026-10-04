import { Router } from 'express';
import { asyncHandler as h } from '../middleware/errors.js';
import { createInvestigation, getInvestigation, revealInvestigation } from '../controllers/investigationController.js';
const r = Router();
r.post('/', h(createInvestigation));
r.get('/:id', h(getInvestigation));
r.post('/:id/reveal', h(revealInvestigation)); // reveals the solution for an unsolved investigation
export default r;
