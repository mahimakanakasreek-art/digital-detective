import 'dotenv/config';
import { connectDb, disconnectDb } from '../config/db.js';
import Case from '../models/Case.js';
import Suspect from '../models/Suspect.js';
import Clue from '../models/Clue.js';
import Evidence from '../models/Evidence.js';
import { CASE_404 } from './case404.js';
import { CASE_217 } from './case217.js';
import { CASE_731 } from './case731.js';

const CASES = [CASE_404, CASE_217, CASE_731];

// Idempotent: every document is upserted by (case, key), so running `npm run seed` again updates
// every case in place and never creates duplicates. Each case only touches its own documents, so seeding one never changes another. Records removed from the seed file are pruned.
async function upsert(Model, filter, doc) {
  return Model.findOneAndUpdate(filter, { $set: doc }, { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true });
}
async function seedCase(d) {
  const { suspects, clues, evidence, solution, ...caseFields } = d;
  const caseDoc = await upsert(Case, { caseId: d.caseId }, caseFields);
  const base = { case: caseDoc._id };

  const sid = {};
  for (const { key, ...s } of suspects) sid[key] = (await upsert(Suspect, { ...base, key }, { ...s, ...base, key }))._id;
  const cid = {};
  for (const { key, suspects: sk, ...c } of clues) cid[key] = (await upsert(Clue, { ...base, key }, { ...c, ...base, key, suspects: sk.map((k) => sid[k]) }))._id;
  for (const { key, clues: ck, ...e } of evidence) await upsert(Evidence, { ...base, key }, { ...e, ...base, key, clues: ck.map((k) => cid[k]) });

  if (!sid[solution]) throw new Error(`Solution suspect "${solution}" is not in the seed data`);
  await Case.updateOne({ _id: caseDoc._id }, { $set: { 'solution.suspect': sid[solution] } });
  for (const [Model, list] of [[Suspect, suspects], [Clue, clues], [Evidence, evidence]]) await Model.deleteMany({ ...base, key: { $nin: list.map((x) => x.key) } });

  const n = await Promise.all([Suspect, Clue, Evidence].map((M) => M.countDocuments(base)));
  console.log(`[seed] Case ${d.caseId} "${d.title}" ready: ${n[0]} suspects, ${n[1]} clues, ${n[2]} evidence. Solution: ${solution}.`);
}
async function seed() {
  await connectDb();
  for (const d of CASES) await seedCase(d);
  console.log(`[seed] done: ${await Case.countDocuments()} case(s) in the database.`);
}
seed().then(() => disconnectDb()).catch(async (err) => { console.error('[seed] failed:', err.message); await disconnectDb().catch(() => {}); process.exit(1); });
