import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { computeProgress } from '../data/progress';
import { createInvestigation, revealInvestigation } from '../api/client';
import { useCaseDataState } from './CaseDataContext';

const keyFor = (caseId) => `dd-case-${caseId}`; // Case 404 keeps its original key (dd-case-404), so saved progress survives
const fresh = (caseId) => ({ caseId, suspect: null, clues: [], evidence: [], deduction: '', submitted: false, result: null, investigationId: null, inspected: null, viewed: { suspects: [], clues: [], evidence: [] } });
const load = (caseId) => { try { return { ...fresh(caseId), ...JSON.parse(sessionStorage.getItem(keyFor(caseId))), caseId }; } catch { return fresh(caseId); } };
const toggle = (arr, id) => (arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);
const viewKey = { suspect: 'suspects', clue: 'clues', evidence: 'evidence' };

function reducer(s, a) {
  switch (a.type) {
    case 'INSPECT': {
      const k = viewKey[a.kind];
      return { ...s, inspected: { kind: a.kind, id: a.id }, viewed: { ...s.viewed, [k]: s.viewed[k].includes(a.id) ? s.viewed[k] : [...s.viewed[k], a.id] } };
    }
    case 'SUSPECT': return { ...s, suspect: s.suspect === a.id ? null : a.id };
    case 'CLUE': return { ...s, clues: toggle(s.clues, a.id) };
    case 'EVIDENCE': return { ...s, evidence: toggle(s.evidence, a.id) };
    case 'DEDUCTION': return { ...s, deduction: a.text };
    case 'SUBMIT': return { ...s, submitted: true, result: a.result, investigationId: a.id };
    case 'REVEAL': return { ...s, result: s.result && { ...s.result, reveal: a.reveal } };
    case 'CLEAR_RESULT': return { ...s, submitted: false, result: null, investigationId: null };
    case 'LOAD': return a.state; // switch to another case's saved progress
    case 'RESET': return fresh(s.caseId);
    default: return s;
  }
}

const Ctx = createContext(null);
export function CaseProvider({ children, caseId }) {
  const [state, dispatch] = useReducer(reducer, caseId, load);
  // Progress is stored per case; state.caseId says which case the current state belongs to.
  useEffect(() => { try { sessionStorage.setItem(keyFor(state.caseId), JSON.stringify(state)); } catch { /* ignore */ } }, [state]);
  useEffect(() => { if (state.caseId !== caseId) dispatch({ type: 'LOAD', state: load(caseId) }); }, [caseId]); // eslint-disable-line react-hooks/exhaustive-deps
  const [sub, setSub] = useState({ busy: false, error: null });
  const loaded = useCaseDataState()?.data; // lets progress use the real number of suspects / evidence items
  const nS = loaded?.suspects.length, nE = loaded?.evidence.length;
  const api = useMemo(() => ({
    state,
    progress: computeProgress(state, { suspects: nS, evidence: nE }),
    inspect: (kind, id) => dispatch({ type: 'INSPECT', kind, id }),
    select: (kind, id) => dispatch({ type: kind === 'suspect' ? 'SUSPECT' : kind === 'clue' ? 'CLUE' : 'EVIDENCE', id }),
    isSelected: (kind, id) => (kind === 'suspect' ? state.suspect === id : kind === 'clue' ? state.clues.includes(id) : state.evidence.includes(id)),
    setDeduction: (text) => dispatch({ type: 'DEDUCTION', text }),
    submitState: sub,
    // Sends the deduction to POST /api/investigations; the backend result is stored for the Result page.
    submit: async (caseId) => {
      setSub({ busy: true, error: null });
      try {
        const inv = await createInvestigation({ caseId, suspect: state.suspect, clues: state.clues, evidence: state.evidence, deduction: state.deduction });
        dispatch({ type: 'SUBMIT', result: inv.result, id: inv.id });
        setSub({ busy: false, error: null });
        return true;
      } catch (error) { setSub({ busy: false, error }); return false; }
    },
    reveal: async () => { dispatch({ type: 'REVEAL', reveal: await revealInvestigation(state.investigationId) }); },
    clearResult: () => dispatch({ type: 'CLEAR_RESULT' }),
    reset: () => dispatch({ type: 'RESET' }),
  }), [state, sub, nS, nE]);
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
export const useCase = () => useContext(Ctx);
