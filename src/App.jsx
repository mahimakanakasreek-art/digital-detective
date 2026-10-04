import { useEffect, useRef, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Environment from './components/Environment';
import { TopHud, BottomHud } from './components/Hud';
import useParallax from './hooks/useParallax';
import Landing from './pages/Landing';
import CaseFiles from './pages/CaseFiles';
import SuspectProfile from './pages/SuspectProfile';
import Investigation from './pages/Investigation';
import Deduction from './pages/Deduction';
import Result from './pages/Result';
import { DataGate, LOAD } from './components/Status';

const gate = (el, messages) => <DataGate messages={messages}>{el}</DataGate>;

// Keeps the old page on screen while it animates out, then swaps in the new one.
export default function App() {
  useParallax();
  const location = useLocation();
  const [shown, setShown] = useState(location);
  const [phase, setPhase] = useState('in');
  const [scan, setScan] = useState(0);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (location.pathname === shown.pathname) { setShown(location); return; }
    setPhase('out'); setScan((n) => n + 1);
    const t = setTimeout(() => { setShown(location); setPhase('in'); window.scrollTo(0, 0); }, 320);
    return () => clearTimeout(t);
  }, [location]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <Environment />
      {scan > 0 && <div className="hud-scan" key={scan} />}
      <div className="app">
        <TopHud />
        <main className="stage">
          <div className={'page ' + (phase === 'out' ? 'out' : '')} key={phase === 'out' ? 'o' : shown.pathname}>
            <Routes location={shown}>
              <Route path="/" element={<Landing />} />
              <Route path="/case-files" element={<CaseFiles />} />
              <Route path="/suspects/:id" element={gate(<SuspectProfile />, LOAD.suspects)} />
              <Route path="/investigation" element={gate(<Investigation />, LOAD.room)} />
              <Route path="/deduction" element={gate(<Deduction />, LOAD.room)} />
              <Route path="/result" element={gate(<Result />, LOAD.submit)} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
        <BottomHud />
      </div>
    </>
  );
}
