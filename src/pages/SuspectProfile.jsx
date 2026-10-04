import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useCaseData } from '../context/CaseDataContext';
import { useCase } from '../context/CaseContext';
import { TiltCard, MagneticButton, Decrypt } from '../components/Ui';

export default function SuspectProfile() {
  const { id } = useParams();
  const { suspects: SUSPECTS, clues: CLUES } = useCaseData();
  const s = SUSPECTS.find((x) => x.id === id);
  const { inspect, select, isSelected, state } = useCase();
  const go = useNavigate();
  const [tab, setTab] = useState('overview');
  useEffect(() => { if (s) inspect('suspect', s.id); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!s) return <Navigate to="/case-files" replace />;
  const i = SUSPECTS.indexOf(s), nx = SUSPECTS[(i + 1) % SUSPECTS.length], pv = SUSPECTS[(i + SUSPECTS.length - 1) % SUSPECTS.length], sel = isSelected('suspect', s.id);
  const clues = CLUES.filter((c) => c.suspects.includes(s.id));
  return (
    <section className="profile">
      <div className="crumbs mono"><Link to="/case-files">◂ CASE FILES</Link> / SUSPECT {String(i + 1).padStart(2, '0')}</div>
      <div className="profile-grid">
        <TiltCard className="dossier panel" max={6}>
          <span className="avatar big">{s.initials}</span>
          <h1 className="h1"><Decrypt text={s.name} /></h1>
          <p className="role mono">{s.role}</p>
          <span className={'badge mono ' + (sel ? 'on' : '')}>{sel ? '● PRIME SUSPECT' : s.status}</span>
          <div className="gauge"><span className="mono sub">ACCESS · {s.access}</span><div className="bar"><i style={{ width: s.accessPct + '%' }} /></div></div>
          <div className="gauge red"><span className="mono sub">SUSPICION INDEX · {s.risk}</span><div className="bar"><i style={{ width: s.risk + '%' }} /></div></div>
        </TiltCard>
        <div className="panel profile-body">
          <div className="tabs mono">{['overview', 'activity', 'notes', 'clues'].map((t) => <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t.toUpperCase()}</button>)}</div>
          <div className="tab-body" key={tab}>
            {tab === 'overview' && <><h3 className="mono sub">SUSPICIOUS ACTIVITY</h3><p>{s.activity}</p><h3 className="mono sub">STATUS</h3><p>{s.status}</p></>}
            {tab === 'activity' && <ul className="log">{s.log.map((l) => <li key={l.time + l.event}><b className="mono">{l.time}</b><span>{l.event}</span></li>)}</ul>}
            {tab === 'notes' && <><h3 className="mono sub">INVESTIGATOR NOTES</h3><p>{s.notes}</p></>}
            {tab === 'clues' && (clues.length ? <div className="chips col">{clues.map((c) => <button key={c.id} className={'chip clue ' + (isSelected('clue', c.id) ? 'on' : '')} onClick={() => { inspect('clue', c.id); select('clue', c.id); }}>{isSelected('clue', c.id) ? '✓ ' : '+ '}{c.title} — {c.short}</button>)}</div> : <p>No clues are linked yet.</p>)}
          </div>
          <div className="row">
            <button className={'btn-sm ' + (sel ? 'on' : '')} onClick={() => select('suspect', s.id)}>{sel ? '✓ PRIME SUSPECT — REMOVE' : 'SELECT AS PRIME SUSPECT'}</button>
            <Link className="btn-sm" to="/deduction">GO TO DEDUCTION</Link>
          </div>
        </div>
      </div>
      <div className="pager">
        <Link className="btn-sm" to={'/suspects/' + pv.id}>◂ {pv.name}</Link>
        <MagneticButton onClick={() => go('/case-files')}>RETURN TO CASE FILES</MagneticButton>
        <Link className="btn-sm" to={'/suspects/' + nx.id}>{nx.name} ▸</Link>
      </div>
    </section>
  );
}
