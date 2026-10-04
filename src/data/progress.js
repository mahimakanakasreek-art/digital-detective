// Investigation progress is derived from what the player has viewed and selected.
// `totals` (optional) = how many suspects / evidence items the active case has; defaults match Cases 404 and 217.
export function computeProgress(s, totals = {}) {
  const pct = (n, t) => Math.min(100, Math.round((n / t) * 100));
  const evidenceReview = pct(s.viewed.evidence.length, totals.evidence || 6);
  const suspectAnalysis = pct(s.viewed.suspects.length, totals.suspects || 3);
  const clueConnection = pct(s.clues.length, 4);
  const inputs = [!!s.suspect, s.clues.length >= 2, s.evidence.length >= 1, s.deduction.trim().length >= 12];
  const done = inputs.filter(Boolean).length;
  const ready = done === 4;
  const overall = Math.round((evidenceReview + suspectAnalysis + clueConnection + (done / 4) * 100) / 4);
  return { evidenceReview, suspectAnalysis, clueConnection, inputs, done, ready, overall };
}
