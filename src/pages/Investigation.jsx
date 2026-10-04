import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Board from '../components/Board';
import { ItemCard, DetailPanel, Progress } from '../components/Items';
import { MagneticButton, Decrypt } from '../components/Ui';
import { useCaseData } from '../context/CaseDataContext';

export default function Investigation() {
  const { caseInfo, suspects, clues, evidence } = useCaseData();
  const TABS = { suspect: ['SUSPECTS', suspects], clue: ['CLUES', clues], evidence: ['EVIDENCE', evidence] };
  const [tab, setTab] = useState('suspect');
  const go = useNavigate();
  return (
    <section className="room">
      <header className="pg-head"><p className="eyebrow mono">INVESTIGATION ROOM · CASE {caseInfo.caseId}</p><h1 className="h1"><Decrypt text="INVESTIGATION COMMAND CENTER" /></h1></header>
      <div className="room-grid">
        <div className="room-main">
          <Board />
          <div className="tabs mono">{Object.entries(TABS).map(([k, [l]]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>)}</div>
          <div className={'cards ' + (tab === 'suspect' ? 'c3' : 'c6')} key={tab}>{TABS[tab][1].map((it) => <ItemCard key={it.id} type={tab} item={it} mode="select" />)}</div>
        </div>
        <div className="stack"><DetailPanel /><Progress /></div>
      </div>
      <div className="cta center">
        <MagneticButton onClick={() => go('/case-files')}>CASE FILES</MagneticButton>
        <MagneticButton primary onClick={() => go('/deduction')}>PROCEED TO DEDUCTION</MagneticButton>
      </div>
    </section>
  );
}
