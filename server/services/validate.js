// Validates the POST /api/investigations body against the loaded case data. Returns { errors, value }.
const isKeyList = (v) => Array.isArray(v) && v.every((x) => typeof x === 'string');
export function validateInvestigation(body, data) {
  const errors = [];
  const b = body && typeof body === 'object' ? body : {};
  const suspect = typeof b.suspect === 'string' ? b.suspect : null;
  if (!suspect || !data.suspects.some((s) => s.key === suspect)) errors.push('suspect must be the id of a suspect in this case');
  const list = (field, docs, min, label) => {
    if (!isKeyList(b[field])) { errors.push(`${field} must be an array of ${label} ids`); return []; }
    const uniq = [...new Set(b[field])];
    const unknown = uniq.filter((k) => !docs.some((d) => d.key === k));
    if (unknown.length) errors.push(`unknown ${label} ids: ${unknown.join(', ')}`);
    if (uniq.length < min) errors.push(`select at least ${min} ${label}${min > 1 ? 's' : ''}`);
    return uniq;
  };
  const clues = list('clues', data.clues, 2, 'clue');
  const evidence = list('evidence', data.evidence, 1, 'evidence');
  const deduction = typeof b.deduction === 'string' ? b.deduction.trim() : '';
  if (deduction.length < 12) errors.push('deduction must be at least 12 characters');
  if (deduction.length > 2000) errors.push('deduction must be at most 2000 characters');
  return { errors, value: { suspect, clues, evidence, deduction } };
}
