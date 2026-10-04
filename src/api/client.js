// All backend access lives here. In dev, Vite proxies /api to the Express server (see vite.config.js).
const BASE = import.meta.env.VITE_API_URL || '/api';

export class ApiError extends Error {
  constructor(message, { status = 0, code = 'NETWORK_ERROR', details } = {}) { super(message); this.status = status; this.code = code; this.details = details; }
}
async function request(path, { method = 'GET', body } = {}) {
  let res;
  try {
    res = await fetch(BASE + path, { method, headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined });
  } catch { throw new ApiError('Unable to reach the case server.'); }
  let json = null;
  try { json = await res.json(); } catch { /* not JSON */ }
  if (!res.ok) throw new ApiError(json?.error?.message || `Request failed (${res.status})`, { status: res.status, code: json?.error?.code || 'HTTP_' + res.status, details: json?.error?.details });
  if (json == null) throw new ApiError('The server sent an invalid response.', { status: res.status, code: 'BAD_RESPONSE' });
  return json;
}

export const listCases = () => request('/cases').then((r) => r.cases);
export async function loadCase(caseId) {
  const id = encodeURIComponent(caseId);
  const [c, s, cl, e] = await Promise.all([request(`/cases/${id}`), request(`/cases/${id}/suspects`), request(`/cases/${id}/clues`), request(`/cases/${id}/evidence`)]);
  return { caseInfo: c.case, suspects: s.suspects, clues: cl.clues, evidence: e.evidence };
}
export const createInvestigation = (payload) => request('/investigations', { method: 'POST', body: payload }).then((r) => r.investigation);
export const getInvestigation = (id) => request(`/investigations/${encodeURIComponent(id)}`).then((r) => r.investigation);
export const revealInvestigation = (id) => request(`/investigations/${encodeURIComponent(id)}/reveal`, { method: 'POST' }).then((r) => r.reveal);
