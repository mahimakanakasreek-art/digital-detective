import { useNavigate } from 'react-router-dom';
import { MagneticButton, TiltCard, Decrypt, Typed } from '../components/Ui';
import { useCaseDataState } from '../context/CaseDataContext';
import { useActiveCase } from '../context/ActiveCase';

// Shown until (or if) the API answers, so the landing page never depends on the backend.
const FALLBACK = { caseId: '404', label: 'HELIX RESEARCH LAB · SECURED', title: 'THE MISSING PROTOTYPE', summary: 'A confidential prototype has disappeared from a secured research laboratory. Investigate the evidence, examine the suspects and uncover what really happened.' };

export default function Landing() {
  const go = useNavigate();
  const { caseId } = useActiveCase();
  // Before the API answers, Case 404 uses built-in text; any other case shows its id until its data arrives.
  const CASE = useCaseDataState().data?.caseInfo || (caseId === FALLBACK.caseId ? FALLBACK : { caseId, label: '', title: '', summary: '' });
  return (
    <section className="landing">
      <div className="landing-copy">
        <p className="eyebrow mono"><i className="dot red blink" />CLASSIFIED INVESTIGATION TERMINAL · NODE 04</p>
        <h1 className="title"><Decrypt text="DIGITAL DETECTIVE" speed={34} /></h1>
        <div className="case-tag"><span className="case-num">CASE {CASE.caseId}</span><span className="case-sub">{CASE.title}</span></div>
        <p className="desc"><Typed text={CASE.summary} speed={14} /></p>
        <div className="cta">
          <MagneticButton primary onClick={() => go('/investigation')}>START INVESTIGATION</MagneticButton>
          <MagneticButton onClick={() => go('/case-files')}>CASE FILES</MagneticButton>
        </div>
      </div>
      <div className="landing-visual">
        <div className="rings"><i /><i /><i /></div>
        <TiltCard className="holo-file" max={14}>
          <span className="mono sub">{CASE.label || FALLBACK.label}</span>
          <strong className="big">{CASE.caseId}</strong>
          <span className="mono">{CASE.title}</span>
          <div className="holo-lines"><i /><i /><i /><i /></div>
          <span className="stamp mono">CONFIDENTIAL</span>
        </TiltCard>
      </div>
    </section>
  );
}
