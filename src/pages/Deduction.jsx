import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Board from '../components/Board';
import { ItemCard, DetailPanel, Progress } from '../components/Items';
import { MagneticButton, Decrypt } from '../components/Ui';
import { LoadingScreen, LOAD } from '../components/Status';
import { useCaseData } from '../context/CaseDataContext';
import { useCase } from '../context/CaseContext';

export default function Deduction() {
  const { state, progress: p, setDeduction, submit, submitState } = useCase();
  const { caseInfo, suspects, clues, evidence, getItem, codeOf } = useCaseData();
  const STEPS = [['suspect', '1 · SUSPECT', suspects], ['clue', '2 · CLUES', clues], ['evidence', '3 · EVIDENCE', evidence], ['deduce', '4 · DEDUCTION']];
  const [step, setStep] = useState('suspect');
  const go = useNavigate();
  const cur = STEPS.find((s) => s[0] === step), idx = STEPS.indexOf(cur);
  const draft = () => {
    const s = state.suspect && getItem('suspect', state.suspect);
    const t = (k, ids) => ids.map((i) => getItem(k, i).title).join(', ');
    setDeduction(`I accuse ${s ? s.name + ' (' + s.role + ')' : '[suspect]'}. The clues (${t('clue', state.clues) || '…'}) and the evidence (${t('evidence', state.evidence) || '…'}) connect them to the removal of ${caseInfo.subject || 'the missing item'}.`);
  };
  const missing = ['select a suspect', 'select at least 2 clues', 'select at least 1 piece of evidence', 'write your deduction (12+ characters)'].filter((_, i) => !p.inputs[i]);
  const file = async () => { if (await submit(caseInfo.caseId)) go('/result'); };
  const Slot = ({ k, ids }) => ids.length ? ids.map((id, n) => <div className="pin-card" key={id}><span className="marker mono">{k === 'suspect' ? 'S' : n + 1}</span><b className="mono">{codeOf(k, id)}</b>{getItem(k, id).name || getItem(k, id).title}</div>) : <div className="pin-card empty">NONE SELECTED</div>;
  if (submitState.busy) return <LoadingScreen messages={LOAD.submit} />;
  return (
    <section className="deduction">
      <header className="pg-head"><p className="eyebrow mono">DEDUCTION TERMINAL · CASE {caseInfo.caseId}</p><h1 className="h1"><Decrypt text="FORM YOUR DEDUCTION" /></h1></header>
      <div className="room-grid">
        <div className="room-main">
          <div className="tabs mono">{STEPS.map(([k, l]) => <button key={k} className={step === k ? 'on' : ''} onClick={() => setStep(k)}>{l}</button>)}</div>
          {step !== 'deduce' ? (
            <div className={'cards ' + (step === 'suspect' ? 'c3' : 'c6')} key={step}>{cur[2].map((it) => <ItemCard key={it.id} type={step} item={it} mode="select" />)}</div>
          ) : (
            <div className="panel deduce-box">
              <h3 className="ph mono"><i className="dot red blink" />YOUR DEDUCTION</h3>
              <textarea aria-label="Your deduction" value={state.deduction} onChange={(e) => setDeduction(e.target.value)} placeholder={`Explain who took ${caseInfo.subject || 'the missing item'} and how the evidence proves it…`} rows={5} />
              <div className="row"><button className="btn-sm" onClick={draft}>AUTO-DRAFT FROM SELECTION</button><span className="mono sub">{state.deduction.length} CHARS</span></div>
            </div>
          )}
          <div className="row between">
            <button className="btn-sm" disabled={idx === 0} onClick={() => setStep(STEPS[idx - 1][0])}>◂ PREVIOUS</button>
            <button className="btn-sm" disabled={idx === 3} onClick={() => setStep(STEPS[idx + 1][0])}>NEXT ▸</button>
          </div>
          <div className="dboard panel">
            <h3 className="ph mono"><i className="dot blue blink" />3D DEDUCTION BOARD</h3>
            <div className="dslots">
              <div><span className="mono sub">SELECTED SUSPECT</span><div className="slot"><Slot k="suspect" ids={state.suspect ? [state.suspect] : []} /></div></div>
              <div><span className="mono sub">SELECTED CLUES</span><div className="slot"><Slot k="clue" ids={state.clues} /></div></div>
              <div><span className="mono sub">SELECTED EVIDENCE</span><div className="slot"><Slot k="evidence" ids={state.evidence} /></div></div>
              <div><span className="mono sub">YOUR DEDUCTION</span><div className="slot ded">{state.deduction || <em>No deduction written yet.</em>}</div></div>
            </div>
            <Board compact />
          </div>
        </div>
        <div className="stack">
          <Progress /><DetailPanel />
          <div className="panel submit">
            <MagneticButton primary disabled={!p.ready} onClick={file} data-testid="submit">SUBMIT DEDUCTION</MagneticButton>
            {!p.ready && <p className="mono sub">REQUIRED: {missing.join(' · ')}</p>}
            {submitState.error && <p className="mono sub red" role="alert" data-testid="submit-error">TRANSMISSION FAILED — {submitState.error.status === 400 ? (submitState.error.details || [submitState.error.message]).join(' · ') : 'CASE DATABASE UNAVAILABLE'}. TRY AGAIN.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
