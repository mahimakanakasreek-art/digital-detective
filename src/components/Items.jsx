import { Link, useNavigate } from 'react-router-dom';
import { TiltCard } from './Ui';
import { Decrypt } from './Ui';
import { useCase } from '../context/CaseContext';
import { useCaseData } from '../context/CaseDataContext';
import { Reveal } from './Ui';

// Glyph drawn with pure CSS per item kind.
const Glyph = ({ kind }) => <span className={'glyph g-' + kind} aria-hidden="true"><i /><i /></span>;

export function ItemCard({ type, item, mode = 'inspect', openProfile }) {
  const { state, inspect, select, isSelected } = useCase();
  const { codeOf } = useCaseData();
  const navigate = useNavigate();
  const sel = isSelected(type, item.id);
  const insp = state.inspected?.kind === type && state.inspected?.id === item.id;
  const order = type === 'clue' ? state.clues.indexOf(item.id) + 1 : type === 'evidence' ? state.evidence.indexOf(item.id) + 1 : 0;
  const click = () => {
    inspect(type, item.id);
    if (openProfile) navigate('/suspects/' + item.id);
    else if (mode === 'select') select(type, item.id);
  };
  return (
    <TiltCard as="button" className={`card ${type} ${sel ? 'sel' : ''} ${insp ? 'insp' : ''}`} onClick={click} aria-pressed={sel} data-testid={`${type}-${item.id}`}>
      {sel && <span className="marker mono">{type === 'suspect' ? 'S' : order}</span>}
      <span className="shine" />
      {type === 'suspect' ? <span className="avatar">{item.initials}</span> : <Glyph kind={item.kind} />}
      <span className="code mono">{codeOf(type, item.id)}</span>
      <strong>{item.name || item.title}</strong>
      <small>{type === 'suspect' ? item.role : item.short}</small>
      <span className="more mono">{item.reveal}</span>
    </TiltCard>
  );
}

export function DetailPanel() {
  const { state, inspect, select, isSelected } = useCase();
  const { clues: CLUES, evidence: EVIDENCE, getItem, codeOf } = useCaseData();
  const related = (kind, id) => {
    if (kind === 'suspect') return CLUES.filter((c) => c.suspects.includes(id)).map((c) => ['clue', c]);
    if (kind === 'clue') { const c = getItem('clue', id); return [...c.suspects.map((s) => ['suspect', getItem('suspect', s)]), ...EVIDENCE.filter((e) => e.clues.includes(id)).map((e) => ['evidence', e])]; }
    return getItem('evidence', id).clues.map((c) => ['clue', getItem('clue', c)]);
  };
  const cur = state.inspected;
  if (!cur) return <aside className="panel detail empty"><h3 className="ph mono"><i className="dot blue blink" />EVIDENCE VIEWER</h3><p className="mut">Select any suspect, clue or piece of evidence to examine it here. Related items will light up on the board.</p></aside>;
  const it = getItem(cur.kind, cur.id), sel = isSelected(cur.kind, cur.id);
  return (
    <aside className={'panel detail ' + cur.kind} key={cur.kind + cur.id}>
      <h3 className="ph mono"><i className="dot red blink" />{codeOf(cur.kind, cur.id)} · {cur.kind.toUpperCase()}</h3>
      <h2><Decrypt text={it.name || it.title} /></h2>
      {cur.kind === 'suspect' ? (<>
        <p className="mono sub">{it.role} · ACCESS {it.access} · {it.status}</p>
        <p><b>Activity:</b> {it.activity}</p><p><b>Notes:</b> {it.notes}</p>
      </>) : (<><p>{it.detail}</p><p className="mono sub">RECOVERED FROM: {it.found}</p></>)}
      <div className="chips"><span className="mono sub">RELATED</span>
        {related(cur.kind, cur.id).map(([k, r]) => <button key={k + r.id} className={'chip ' + k} onClick={() => inspect(k, r.id)}>{codeOf(k, r.id)} {r.name || r.title}</button>)}
      </div>
      <div className="row">
        <button className={'btn-sm ' + (sel ? 'on' : '')} onClick={() => select(cur.kind, cur.id)}>{sel ? '✓ SELECTED — REMOVE' : cur.kind === 'suspect' ? 'SELECT AS PRIME SUSPECT' : 'ADD TO DEDUCTION'}</button>
        {cur.kind === 'suspect' && <Link className="btn-sm" to={'/suspects/' + it.id}>OPEN FULL PROFILE</Link>}
      </div>
    </aside>
  );
}

export function Progress() {
  const { progress: p } = useCase();
  const Row = ({ label, v, text }) => (
    <div className="prow"><span className="mono">{label}</span><div className="bar"><i style={{ width: v + '%' }} /></div><b className={'mono ' + (v === 100 ? 'ok' : '')}>{text ?? (v === 100 ? '✓' : v + '%')}</b></div>
  );
  return (
    <div className="panel progress" data-testid="progress">
      <h3 className="ph mono"><i className="dot amber blink" />INVESTIGATION PROGRESS<em>{p.overall}%</em></h3>
      <Row label="EVIDENCE REVIEW" v={p.evidenceReview} />
      <Row label="SUSPECT ANALYSIS" v={p.suspectAnalysis} />
      <Row label="CLUE CONNECTION" v={p.clueConnection} />
      <Row label="DEDUCTION" v={(p.done / 4) * 100} text={p.ready ? 'READY' : p.done + '/4 INPUTS'} />
    </div>
  );
}

export function Timeline({ events = [] }) {
  return (
    <div className="timeline" data-testid="timeline">
      {events.map((e, i) => (
        <Reveal key={e.n} delay={i * 120} className={'tl-item ' + (i % 2 ? 'r' : 'l')}>
          <span className="tl-dot"><i /></span>
          <div className="tl-card panel"><span className="mono sub">EVENT {e.n} · {e.time}</span><h4>{e.title}</h4><p>{e.text}</p></div>
        </Reveal>
      ))}
    </div>
  );
}
