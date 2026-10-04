import { codeFor } from './serialize.js';
// Server-side deduction logic (moved from the frontend). Data shape: { caseDoc, suspects, clues, evidence } (plain objects).
const feedback = (type) => (d) => ({ id: d.key, code: codeFor(type, d.order), title: d.title, detail: d.detail, hint: d.hint, why: d.why, kind: d.kind });
const asClue = feedback('clue'), asEvidence = feedback('evidence');

export function buildReveal(data) {
  const { caseDoc, suspects, clues, evidence } = data;
  const sol = suspects.find((s) => String(s._id) === String(caseDoc.solution?.suspect));
  const split = !!caseDoc.report?.splitRoles; // cases that set report.splitRoles list key / supporting / misleading items separately
  const clueList = (pred) => clues.filter(pred).map(asClue), evList = (pred) => evidence.filter(pred).map(asEvidence);
  // Legacy grouping (Case 404): "misleading clues" holds every non-key clue; "supporting evidence" holds key + supporting evidence.
  return {
    solution: sol ? { id: sol.key, name: sol.name, role: sol.role } : null,
    report: {
      what: caseDoc.report?.what, conclusion: caseDoc.report?.conclusion,
      importantClues: clueList((c) => c.role === 'key'),
      supportingClues: split ? clueList((c) => c.role === 'supporting') : [],
      misleadingClues: clueList((c) => (split ? c.role === 'misleading' : c.role !== 'key')),
      importantEvidence: split ? evList((e) => e.role === 'key') : [],
      supportingEvidence: evList((e) => (split ? e.role === 'supporting' : e.role !== 'misleading')),
      misleadingEvidence: evList((e) => e.role === 'misleading'),
    },
    timeline: caseDoc.timeline || [],
  };
}

export function evaluate(sel, data, { revealed = false } = {}) {
  const { caseDoc, suspects, clues, evidence } = data;
  const sus = suspects.find((s) => s.key === sel.suspect);
  const solved = !!sus && String(sus._id) === String(caseDoc.solution?.suspect);
  const pickC = clues.filter((c) => sel.clues.includes(c.key)), pickE = evidence.filter((e) => sel.evidence.includes(e.key));
  const keyTotal = clues.filter((c) => c.role === 'key').length + evidence.filter((e) => e.role === 'key').length;
  const keyChosen = pickC.filter((c) => c.role === 'key').length + pickE.filter((e) => e.role === 'key').length;
  return {
    solved, strength: keyTotal ? Math.round((keyChosen / keyTotal) * 100) : 0,
    suspect: sus ? { id: sus.key, name: sus.name, role: sus.role } : null,
    keyClues: pickC.filter((c) => c.role === 'key').map(asClue), misleadingClues: pickC.filter((c) => c.role === 'misleading').map(asClue),
    keyEvidence: pickE.filter((e) => e.role === 'key').map(asEvidence), misleadingEvidence: pickE.filter((e) => e.role === 'misleading').map(asEvidence),
    missedClues: clues.filter((c) => c.role === 'key' && !sel.clues.includes(c.key)).map(asClue),
    missedEvidence: evidence.filter((e) => e.role === 'key' && !sel.evidence.includes(e.key)).map(asEvidence),
    reveal: solved || revealed ? buildReveal(data) : null,
  };
}
