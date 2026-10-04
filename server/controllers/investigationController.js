import mongoose from 'mongoose';
import Case from '../models/Case.js';
import Investigation from '../models/Investigation.js';
import { HttpError } from '../middleware/errors.js';
import { findCase, loadBundle } from './caseController.js';
import { validateInvestigation } from '../services/validate.js';
import { evaluate, buildReveal } from '../services/evaluation.js';

const idOf = (docs, key) => docs.find((d) => d.key === key)._id;
const keyOf = (docs, id) => docs.find((d) => String(d._id) === String(id))?.key;
const present = (inv, data, result, caseId) => ({
  id: String(inv._id), caseId,
  suspect: keyOf(data.suspects, inv.suspect), clues: inv.clues.map((i) => keyOf(data.clues, i)).filter(Boolean), evidence: inv.evidence.map((i) => keyOf(data.evidence, i)).filter(Boolean),
  deduction: inv.deduction, result, submittedAt: inv.createdAt,
});
const parseId = (id) => { if (!mongoose.isValidObjectId(id) || String(id).length !== 24) throw new HttpError(400, 'INVALID_ID', 'Investigation id is not valid'); return id; };
async function loadInvestigation(id) {
  const inv = await Investigation.findById(parseId(id)).lean();
  if (!inv) throw new HttpError(404, 'INVESTIGATION_NOT_FOUND', 'Investigation not found');
  const caseDoc = await Case.findById(inv.case).lean();
  if (!caseDoc) throw new HttpError(404, 'CASE_NOT_FOUND', 'The case for this investigation no longer exists');
  return { inv, data: await loadBundle(caseDoc) };
}

export async function createInvestigation(req, res) {
  const caseId = req.body?.caseId;
  if (typeof caseId !== 'string' || !caseId) throw new HttpError(400, 'VALIDATION_ERROR', 'Invalid investigation', ['caseId is required']);
  const data = await loadBundle(await findCase(caseId));
  const { errors, value } = validateInvestigation(req.body, data);
  if (errors.length) throw new HttpError(400, 'VALIDATION_ERROR', 'Invalid investigation', errors);
  const result = evaluate({ suspect: value.suspect, clues: value.clues, evidence: value.evidence }, data);
  const inv = await Investigation.create({
    case: data.caseDoc._id, suspect: idOf(data.suspects, value.suspect), clues: value.clues.map((k) => idOf(data.clues, k)), evidence: value.evidence.map((k) => idOf(data.evidence, k)),
    deduction: value.deduction, result: { solved: result.solved, strength: result.strength },
  });
  res.status(201).json({ investigation: present(inv.toObject(), data, result, caseId) });
}
export async function getInvestigation(req, res) {
  const { inv, data } = await loadInvestigation(req.params.id);
  const sel = { suspect: keyOf(data.suspects, inv.suspect), clues: inv.clues.map((i) => keyOf(data.clues, i)), evidence: inv.evidence.map((i) => keyOf(data.evidence, i)) };
  res.json({ investigation: present(inv, data, evaluate(sel, data, { revealed: inv.revealed }), data.caseDoc.caseId) });
}
export async function revealInvestigation(req, res) {
  const { inv, data } = await loadInvestigation(req.params.id);
  if (!inv.revealed) await Investigation.updateOne({ _id: inv._id }, { $set: { revealed: true } });
  res.json({ reveal: buildReveal(data) });
}
