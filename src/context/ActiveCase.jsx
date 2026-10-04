import { createContext, useCallback, useContext, useMemo, useState } from 'react';

// Which case the player is working on. Persisted for the browser session; defaults to Case 404.
export const DEFAULT_CASE_ID = '404';
const KEY = 'dd-active-case';
const read = () => { try { return sessionStorage.getItem(KEY) || DEFAULT_CASE_ID; } catch { return DEFAULT_CASE_ID; } };

const Ctx = createContext(null);
export function ActiveCaseProvider({ children }) {
  const [caseId, setId] = useState(read);
  const setCaseId = useCallback((id) => { setId(id); try { sessionStorage.setItem(KEY, id); } catch { /* ignore */ } }, []);
  const value = useMemo(() => ({ caseId, setCaseId }), [caseId, setCaseId]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useActiveCase = () => useContext(Ctx);
