import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCase } from '../context/CaseContext';
import { useActiveCase } from '../context/ActiveCase';
import { useCaseDataState } from '../context/CaseDataContext';

const NAV = [['HOME', '/'], ['CASE FILES', '/case-files'], ['INVESTIGATION ROOM', '/investigation'], ['DEDUCTION', '/deduction'], ['CASE RESULT', '/result']];
export function TopHud() {
  const { pathname } = useLocation();
  const { state } = useCase();
  const { caseId } = useActiveCase();
  const d = useCaseDataState()?.data;
  const count = (list, fallback) => (list ? String(list.length).padStart(2, '0') : fallback); // counts come from the active case
  return (
    <header className="hud-top">
      <div className="hud-stats mono">
        <span><i className="dot red" />CASE ID: <b>{caseId}</b></span>
        <span>STATUS: <b className={state.result?.solved ? 'ok' : 'amber'}>{state.result?.solved ? 'SOLVED' : 'ACTIVE'}</b></span>
        <span className="hide-s">SECURITY: <b className="red">CLASSIFIED</b></span>
        <span>EVIDENCE: <b>{count(d?.evidence, '06')}</b></span><span>SUSPECTS: <b>{count(d?.suspects, '03')}</b></span>
      </div>
      <nav className="hud-nav">
        {NAV.map(([label, to]) => <Link key={to} to={to} className={pathname === to || (to === '/case-files' && pathname.startsWith('/suspects')) ? 'on' : ''}>{label}</Link>)}
      </nav>
    </header>
  );
}
export function BottomHud() {
  const { pathname } = useLocation();
  const [t, setT] = useState(() => new Date());
  useEffect(() => { const i = setInterval(() => setT(new Date()), 1000); return () => clearInterval(i); }, []);
  const mode = ['/deduction', '/result'].includes(pathname) ? 'ANALYSIS MODE' : pathname === '/' ? 'STANDBY MODE' : 'INVESTIGATION MODE';
  return (
    <footer className="hud-bot mono">
      <span><i className="dot green" />SYSTEM ONLINE</span>
      <span className="hide-s"><i className="dot amber blink" />DATABASE LINK: STANDBY</span>
      <span className="mode">{mode}</span>
      <span className="hide-s">{t.toLocaleTimeString('en-GB')}</span>
    </footer>
  );
}
