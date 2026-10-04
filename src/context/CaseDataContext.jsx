import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { loadCase } from '../api/client';
import { DEFAULT_CASE_ID } from './ActiveCase';

export { DEFAULT_CASE_ID };
const Ctx = createContext(null);

export function CaseDataProvider({ children, caseId = DEFAULT_CASE_ID }) {
  const [s, setS] = useState({ status: 'loading', data: null, error: null, forCase: caseId });
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let dead = false;
    setS({ status: 'loading', data: null, error: null, forCase: caseId });
    loadCase(caseId).then((data) => !dead && setS({ status: 'ready', data, error: null, forCase: caseId })).catch((error) => !dead && setS({ status: 'error', data: null, error, forCase: caseId }));
    return () => { dead = true; };
  }, [caseId, tick]);
  const retry = useCallback(() => setTick((n) => n + 1), []);
  // Never expose another case's data while this case is loading (e.g. right after switching cases).
  const value = useMemo(() => (s.forCase === caseId ? { ...s, retry } : { status: 'loading', data: null, error: null, forCase: caseId, retry }), [s, retry, caseId]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useCaseDataState = () => useContext(Ctx);

// For components rendered inside <DataGate>: the data is guaranteed to be loaded.
export function useCaseData() {
  const { data } = useContext(Ctx);
  return useMemo(() => {
    const items = { suspect: data.suspects, clue: data.clues, evidence: data.evidence };
    const getItem = (type, id) => items[type].find((i) => i.id === id);
    return { ...data, items, getItem, codeOf: (type, id) => getItem(type, id)?.code ?? id };
  }, [data]);
}
