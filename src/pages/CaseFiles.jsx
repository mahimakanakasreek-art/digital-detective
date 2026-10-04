import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ItemCard, DetailPanel, Progress } from '../components/Items';
import Board from '../components/Board';
import { MagneticButton, Reveal, Decrypt, TiltCard } from '../components/Ui';
import { DataGate, LOAD } from '../components/Status';
import { useCaseData } from '../context/CaseDataContext';
import { useCase } from '../context/CaseContext';
import { useActiveCase } from '../context/ActiveCase';
import { listCases } from '../api/client';

const pad = (n) => (n == null ? '—' : String(n).padStart(2, '0'));

// Every case in the database, as selectable folders. Choosing one makes it the active case for the whole app.
function CaseArchive() {
  const { caseId, setCaseId } = useActiveCase();
  const [list, setList] = useState({ cases: null, error: null });
  useEffect(() => {
    let dead = false;
    listCases().then((cases) => !dead && setList({ cases, error: null })).catch((error) => !dead && setList({ cases: null, error }));
    return () => { dead = true; };
  }, []);
  return (
    <Reveal>
      <h2 className="zone mono">▸ CASE ARCHIVE <em>select a case file</em></h2>
      {list.error && <p className="mono sub red" role="alert">CASE ARCHIVE UNAVAILABLE — {list.error.message}</p>}
      {!list.cases && !list.error && <p className="mono sub">ACCESSING CASE ARCHIVE...</p>}
      {list.cases && (
        <div className="case-grid" data-testid="case-archive">
          {list.cases.map((c) => (
            <TiltCard as="button" type="button" key={c.caseId} max={6} className={'panel case-card ' + (c.caseId === caseId ? 'on' : '')} aria-pressed={c.caseId === caseId} data-testid={'case-card-' + c.caseId} onClick={() => setCaseId(c.caseId)}>
              <span className="case-num">CASE {c.caseId}</span>
              <h3>{c.title}</h3>
              <span className="mono sub">{c.location}</span>
              <span className="mono sub">{c.difficulty ? `DIFFICULTY ${c.difficulty} · ` : ''}{pad(c.suspectCount)} SUSPECTS · {pad(c.clueCount)} CLUES · {pad(c.evidenceCount)} EVIDENCE</span>
              <span className={'mono sub ' + (c.caseId === caseId ? 'amber' : '')}>{c.caseId === caseId ? '● FILE OPEN' : '○ CLICK TO OPEN FILE'}</span>
            </TiltCard>
          ))}
        </div>
      )}
    </Reveal>
  );
}

function CaseDetail() {
  const { progress, state } = useCase();
  const go = useNavigate();
  const { caseInfo: CASE, suspects: SUSPECTS, clues: CLUES, evidence: EVIDENCE } = useCaseData();
  const status = state.result ? (state.result.solved ? 'CASE SOLVED' : 'UNSOLVED — REVIEW') : progress.overall > 0 ? `IN PROGRESS · ${progress.overall}%` : 'NOT STARTED';
  const stats = [['CASE STATUS', CASE.status], ['LOCATION', CASE.location], ['EVIDENCE COUNT', String(EVIDENCE.length).padStart(2, '0')], ['SUSPECT COUNT', String(SUSPECTS.length).padStart(2, '0')], ['INVESTIGATION STATUS', status]];
  return (
    <>
      <header className="pg-head"><p className="eyebrow mono">CASE {CASE.caseId}</p><h1 className="h1"><Decrypt text={CASE.title} /></h1></header>
      <div className="stat-row">{stats.map(([k, v]) => <div className="stat panel" key={k}><span className="mono sub">{k}</span><b>{v}</b></div>)}</div>
      <div className="desk">
        <svg className="desk-strings" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M10 12 C40 40 60 20 90 50" /><path d="M20 70 C50 45 70 80 92 30" /></svg>
        <Reveal><h2 className="zone mono">▸ SUSPECT FOLDERS <em>click to open profile</em></h2><div className="cards c3">{SUSPECTS.map((s) => <ItemCard key={s.id} type="suspect" item={s} openProfile />)}</div></Reveal>
        <Reveal delay={100}><h2 className="zone mono">▸ CLUE DOCUMENTS <em>click to examine</em></h2><div className="cards c6">{CLUES.map((c) => <ItemCard key={c.id} type="clue" item={c} />)}</div></Reveal>
        <Reveal delay={150}><h2 className="zone mono">▸ EVIDENCE PHOTOGRAPHS <em>click to examine</em></h2><div className="cards c6">{EVIDENCE.map((e) => <ItemCard key={e.id} type="evidence" item={e} />)}</div></Reveal>
      </div>
      <div className="split">
        <div><h2 className="zone mono">▸ LIVE INVESTIGATION BOARD</h2><Board compact /></div>
        <div className="stack"><DetailPanel /><Progress /></div>
      </div>
      <div className="cta center">
        <MagneticButton primary onClick={() => go('/investigation')}>START INVESTIGATION</MagneticButton>
        <MagneticButton onClick={() => go('/')}>HOME</MagneticButton>
      </div>
    </>
  );
}

export default function CaseFiles() {
  return (
    <section className="casefiles">
      <CaseArchive />
      <DataGate messages={LOAD.caseFiles} inline><CaseDetail /></DataGate>
    </section>
  );
}
