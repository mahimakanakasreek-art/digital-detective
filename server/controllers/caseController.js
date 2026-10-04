import Case from '../models/Case.js';
import Suspect from '../models/Suspect.js';
import Clue from '../models/Clue.js';
import Evidence from '../models/Evidence.js';
import { HttpError } from '../middleware/errors.js';
import { publicCase, publicSuspect, publicClue, publicEvidence, keyMap } from '../services/serialize.js';

const ID_RE = /^[A-Za-z0-9_-]{1,32}$/;
export async function findCase(caseId) {
  if (!ID_RE.test(String(caseId))) throw new HttpError(400, 'INVALID_CASE_ID', 'caseId may only contain letters, numbers, "-" and "_"');
  const c = await Case.findOne({ caseId: String(caseId) }).lean();
  if (!c) throw new HttpError(404, 'CASE_NOT_FOUND', `Case ${caseId} was not found`);
  return c;
}
export async function loadBundle(caseDoc) {
  const q = { case: caseDoc._id };
  const [suspects, clues, evidence] = await Promise.all([Suspect.find(q).sort('order').lean(), Clue.find(q).sort('order').lean(), Evidence.find(q).sort('order').lean()]);
  return { caseDoc, suspects, clues, evidence };
}
const counts = async (c) => { const q = { case: c._id }; const [s, cl, e] = await Promise.all([Suspect.countDocuments(q), Clue.countDocuments(q), Evidence.countDocuments(q)]); return { suspects: s, clues: cl, evidence: e }; };

export async function listCases(req, res) {
  const cases = await Case.find().sort('caseId').lean();
  res.json({ cases: await Promise.all(cases.map(async (c) => publicCase(c, await counts(c)))) });
}
export async function getCase(req, res) {
  const c = await findCase(req.params.caseId);
  res.json({ case: publicCase(c, await counts(c)) });
}
export async function getSuspects(req, res) {
  const c = await findCase(req.params.caseId);
  res.json({ suspects: (await Suspect.find({ case: c._id }).sort('order').lean()).map(publicSuspect) });
}
export async function getClues(req, res) {
  const c = await findCase(req.params.caseId);
  const [suspects, clues] = await Promise.all([Suspect.find({ case: c._id }).select('key').lean(), Clue.find({ case: c._id }).sort('order').lean()]);
  const sk = keyMap(suspects);
  res.json({ clues: clues.map((x) => publicClue(x, sk)) });
}
export async function getEvidence(req, res) {
  const c = await findCase(req.params.caseId);
  const [clues, evidence] = await Promise.all([Clue.find({ case: c._id }).select('key').lean(), Evidence.find({ case: c._id }).sort('order').lean()]);
  const ck = keyMap(clues);
  res.json({ evidence: evidence.map((x) => publicEvidence(x, ck)) });
}
