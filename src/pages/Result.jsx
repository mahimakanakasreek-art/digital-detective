import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Board from '../components/Board';
import { Timeline } from '../components/Items';
import { MagneticButton, Reveal, Decrypt } from '../components/Ui';
import { useCase } from '../context/CaseContext';
import { useCaseData } from '../context/CaseDataContext';

// Items arrive from the backend with their display code, title and feedback text.
const List = ({ title, items = [], tone, field }) => items.length > 0 && (
  <div className={'panel flist ' + tone}><h3 className="ph mono">{title}</h3>
    <ul>{items.map((i) => <li key={i.id}><b className="mono">{i.code}</b> <strong>{i.title}</strong><p>{i[field] || i.detail}</p></li>)}</ul></div>
);

export default function Result() {
  const { state, clearResult, reset, reveal } = useCase();
  const { getItem, caseInfo } = useCaseData();
  const go = useNavigate();
  const [busy, setBusy] = useState(false);
  const [revealError, setRevealError] = useState(null);
  const r = state.result; // result returned by POST /api/investigations
  if (!r) return (
    <section className="result empty-res">
      <h1 className="h1">NO DEDUCTION FILED</h1><p className="mut">Submit a deduction first to open the case result.</p>
      <div className="cta center"><MagneticButton primary onClick={() => go('/deduction')}>GO TO DEDUCTION</MagneticButton><MagneticButton onClick={() => go('/case-files')}>RETURN TO CASE FILES</MagneticButton></div>
    </section>
  );
  const rev = r.reveal, sus = r.suspect;
  const again = () => { reset(); go('/investigation'); };
  const doReveal = async () => { setBusy(true); setRevealError(null); try { await reveal(); } catch { setRevealError('CASE DATABASE UNAVAILABLE — TRY AGAIN'); } setBusy(false); };
  return (
    <section className={'result ' + (r.solved ? 'solved' : 'unsolved')}>
      <div className="res-hero" data-testid="result-hero">
        {r.solved && <div className="lightshift" />}
        <div className="rings big"><i /><i /><i /></div>
        {r.solved && <div className="burst">{Array.from({ length: 18 }, (_, i) => <span key={i} style={{ '--a': i * 20 + 'deg', '--dl': (i % 6) * 60 + 'ms' }} />)}</div>}
        <div className="cf-close"><i className="cf-back" /><i className="cf-lid mono">CASE {caseInfo.caseId}</i></div>
        <p className="eyebrow mono">CASE {caseInfo.caseId} · INVESTIGATION COMPLETE</p>
        <h1 className={'verdict ' + (r.solved ? 'ok' : 'bad')}>{r.solved ? 'CASE SOLVED' : 'CASE REMAINS UNSOLVED'}</h1>
        <p className="mono sub">EVIDENCE STRENGTH {r.strength}% · {r.keyClues.length + r.keyEvidence.length} KEY ITEMS CONFIRMED</p>
      </div>

      <div className="split">
        <Reveal className="panel summary">
          <h3 className="ph mono"><i className="dot blue blink" />YOUR SUBMISSION</h3>
          <p><span className="mono sub">SELECTED SUSPECT</span><br /><b>{sus?.name}</b> — {sus?.role}</p>
          <p><span className="mono sub">SELECTED CLUES</span><br />{state.clues.map((c) => getItem('clue', c)?.title).join(' · ')}</p>
          <p><span className="mono sub">SELECTED EVIDENCE</span><br />{state.evidence.map((c) => getItem('evidence', c)?.title).join(' · ')}</p>
          <p><span className="mono sub">YOUR DEDUCTION</span><br /><em>“{state.deduction}”</em></p>
          <p><span className="mono sub">RESULT</span><br /><b className={r.solved ? 'ok' : 'red'}>{r.solved ? 'CORRECT — CASE SOLVED' : 'INCORRECT — CASE REMAINS UNSOLVED'}</b></p>
        </Reveal>
        <Reveal delay={120}><Board compact final /></Reveal>
      </div>

      {!r.solved && (
        <Reveal className="feedback">
          <h2 className="h2">INVESTIGATION FEEDBACK</h2>
          <p className="mut">Your accusation is not supported by the strongest evidence. Reconsider the following.</p>
          <div className="fgrid">
            <List title="MISLEADING CLUES YOU RELIED ON" items={r.misleadingClues} tone="warn" field="why" />
            <List title="MISLEADING EVIDENCE YOU RELIED ON" items={r.misleadingEvidence} tone="warn" field="why" />
            <List title="IMPORTANT CLUES OVERLOOKED" items={r.missedClues} tone="key" field="hint" />
            <List title="IMPORTANT EVIDENCE OVERLOOKED" items={r.missedEvidence} tone="key" field="hint" />
            <List title="IMPORTANT CLUES YOU HAD" items={r.keyClues} tone="good" field="hint" />
            <List title="IMPORTANT EVIDENCE YOU HAD" items={r.keyEvidence} tone="good" field="hint" />
          </div>
          {revealError && <p className="mono sub red" role="alert">{revealError}</p>}
          <div className="cta center">
            <MagneticButton primary onClick={() => { clearResult(); go('/deduction'); }}>RETURN TO INVESTIGATION</MagneticButton>
            <MagneticButton onClick={() => go('/case-files')}>RETURN TO CASE FILES</MagneticButton>
            {!rev && <MagneticButton disabled={busy} onClick={doReveal}>REVEAL CLASSIFIED SOLUTION</MagneticButton>}
          </div>
        </Reveal>
      )}

      {rev && (
        <div className="report" data-testid="report">
          <Reveal className="solution panel"><span className="mono sub">ACTUAL SOLUTION</span><h2 className="h1"><Decrypt text={`${rev.solution.name.toUpperCase()} — ${rev.solution.role.toUpperCase()}`} /></h2></Reveal>
          <Reveal className="panel classified">
            <h3 className="ph mono"><i className="dot red blink" />CLASSIFIED INVESTIGATION REPORT · CASE {caseInfo.caseId}<em>TOP SECRET</em></h3>
            <h4 className="mono sub">WHAT HAPPENED</h4><p>{rev.report.what}</p>
            <div className="fgrid">
              <List title="IMPORTANT CLUES" items={rev.report.importantClues} tone="good" field="detail" />
              <List title="IMPORTANT EVIDENCE" items={rev.report.importantEvidence} tone="good" field="detail" />
              <List title="SUPPORTING CLUES" items={rev.report.supportingClues} tone="good" field="detail" />
              <List title="SUPPORTING EVIDENCE" items={rev.report.supportingEvidence} tone="good" field="detail" />
              <List title="MISLEADING CLUES" items={rev.report.misleadingClues} tone="warn" field="why" />
              <List title="MISLEADING EVIDENCE" items={rev.report.misleadingEvidence} tone="warn" field="why" />
            </div>
            <h4 className="mono sub">FINAL CONCLUSION</h4><p>{rev.report.conclusion}</p>
          </Reveal>
          <h2 className="h2 center">CASE TIMELINE</h2>
          <Timeline events={rev.timeline} />
        </div>
      )}
      <div className="cta center">
        <MagneticButton primary onClick={again}>INVESTIGATE AGAIN</MagneticButton>
        <MagneticButton onClick={() => go('/case-files')}>RETURN TO CASE FILES</MagneticButton>
        <MagneticButton onClick={() => go('/')}>HOME</MagneticButton>
      </div>
    </section>
  );
}
