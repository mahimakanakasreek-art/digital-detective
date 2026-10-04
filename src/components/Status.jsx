import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Decrypt, MagneticButton } from './Ui';
import { useCaseDataState } from '../context/CaseDataContext';
import { useActiveCase } from '../context/ActiveCase';

export const LOAD = {
  caseFiles: ['ACCESSING CASE DATABASE...', 'LOADING SUSPECT DATABASE...', 'DECRYPTING EVIDENCE...'],
  room: ['INITIALIZING INVESTIGATION...', 'ACCESSING CASE DATABASE...', 'DECRYPTING EVIDENCE...'],
  suspects: ['ACCESSING CASE DATABASE...', 'LOADING SUSPECT DATABASE...'],
  submit: ['TRANSMITTING DEDUCTION...', 'VERIFYING EVIDENCE CHAIN...', 'COMPILING CASE RESULT...'],
};

export function LoadingScreen({ messages = LOAD.room, inline }) {
  const { caseId } = useActiveCase();
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((n) => Math.min(n + 1, messages.length - 1)), 1000); return () => clearInterval(t); }, [messages]);
  return (
    <section className={'status-screen ' + (inline ? 'inline' : '')} role="status" aria-live="polite" data-testid="loading">
      <div className="rings"><i /><i /><i /></div>
      <div className="status-core panel">
        <p className="eyebrow mono"><i className="dot blue blink" />CASE {caseId} · SECURE LINK</p>
        <h2 className="h2"><Decrypt text={messages[i]} /></h2>
        <div className="scanbar"><i /></div>
        <ul className="mono sub">{messages.slice(0, i).map((m) => <li key={m}>✓ {m.replace('...', '')}</li>)}</ul>
      </div>
    </section>
  );
}

export function ErrorScreen({ onRetry, error, inline }) {
  return (
    <section className={'status-screen error ' + (inline ? 'inline' : '')} role="alert" data-testid="error">
      <div className="rings"><i /><i /><i /></div>
      <div className="status-core panel">
        <p className="eyebrow mono"><i className="dot red blink" />LINK FAILURE · {error?.code || 'NETWORK_ERROR'}</p>
        <h2 className="h1 verdict bad">CONNECTION INTERRUPTED</h2>
        <p className="mono sub">CASE DATABASE UNAVAILABLE</p>
        <p className="mut">{error?.message || 'The case server could not be reached.'}</p>
        <div className="cta center">
          <MagneticButton primary onClick={onRetry}>TRY AGAIN</MagneticButton>
          {!inline && <Link className="btn-sm" to="/">HOME</Link>}
        </div>
      </div>
    </section>
  );
}

// Shows the themed loading / error screen until the case data has arrived from the API.
export function DataGate({ messages, children, inline }) {
  const { status, error, retry } = useCaseDataState();
  if (status === 'loading') return <LoadingScreen messages={messages} inline={inline} />;
  if (status === 'error') return <ErrorScreen error={error} onRetry={retry} inline={inline} />;
  return children;
}
