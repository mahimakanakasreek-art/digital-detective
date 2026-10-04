// Pure helpers: turn database documents into the public JSON the frontend receives.
// Secrets (clue/evidence role, hint, why, case solution, report, timeline) are never included here.
const PREFIX = { suspect: 'S', clue: 'C', evidence: 'E' };
const pad = (n) => String(n).padStart(2, '0');
export const codeFor = (type, order) => `${PREFIX[type]}-${pad(order)}`;
export const keyMap = (docs) => new Map(docs.map((d) => [String(d._id), d.key]));

export const publicCase = (c, counts = {}) => ({
  caseId: c.caseId, title: c.title, status: c.status, security: c.security, location: c.location, summary: c.summary, difficulty: c.difficulty, subject: c.subject, label: c.label,
  suspectCount: counts.suspects ?? null, clueCount: counts.clues ?? null, evidenceCount: counts.evidence ?? null,
});
export const publicSuspect = (s) => ({
  id: s.key, code: codeFor('suspect', s.order), name: s.name, role: s.role, initials: s.initials, access: s.access, accessPct: s.accessPct,
  status: s.status, risk: s.risk, short: s.short, reveal: s.reveal, activity: s.activity, notes: s.notes, log: s.log || [],
});
export const publicClue = (c, suspectKeys) => ({
  id: c.key, code: codeFor('clue', c.order), kind: c.kind, title: c.title, short: c.short, detail: c.detail, reveal: c.reveal, found: c.found,
  suspects: (c.suspects || []).map((id) => suspectKeys.get(String(id))).filter(Boolean),
});
export const publicEvidence = (e, clueKeys) => ({
  id: e.key, code: codeFor('evidence', e.order), kind: e.kind, title: e.title, short: e.short, detail: e.detail, reveal: e.reveal, found: e.found,
  clues: (e.clues || []).map((id) => clueKeys.get(String(id))).filter(Boolean),
});
