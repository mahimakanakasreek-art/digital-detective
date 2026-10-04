import { useMemo } from 'react';
import { useCase } from '../context/CaseContext';
import { useCaseData } from '../context/CaseDataContext';

const ys = (n, a, b) => Array.from({ length: n }, (_, i) => (n === 1 ? 50 : a + ((b - a) / (n - 1)) * i));
const label = (t, i) => (t === 'suspect' ? i.name.split(' ')[0] : i.title.split(' ').slice(0, 2).join(' '));

// Central investigation board: suspect → clue → evidence with animated strings. Layout and links come from the API data.
export default function Board({ compact, final, onNode }) {
  const { state, isSelected, inspect } = useCase();
  const { suspects, clues, evidence } = useCaseData();
  const { POS, LINKS } = useMemo(() => {
    const POS = {};
    ys(suspects.length, 22, 78).forEach((y, i) => (POS['suspect:' + suspects[i].id] = [11, y]));
    ys(clues.length, 8, 92).forEach((y, i) => (POS['clue:' + clues[i].id] = [50, y]));
    ys(evidence.length, 8, 92).forEach((y, i) => (POS['evidence:' + evidence[i].id] = [89, y]));
    const LINKS = [...clues.flatMap((c) => c.suspects.map((s) => ['suspect:' + s, 'clue:' + c.id])), ...evidence.flatMap((e) => e.clues.map((c) => ['clue:' + c, 'evidence:' + e.id]))];
    return { POS, LINKS };
  }, [suspects, clues, evidence]);
  const ins = state.inspected ? state.inspected.kind + ':' + state.inspected.id : null;
  const sel = (k) => { const [t, id] = k.split(':'); return isSelected(t, id); };
  const solId = state.result?.reveal?.solution?.id;
  const chain = (a) => a === 'suspect:' + solId || clues.some((c) => c.id === a.split(':')[1] && c.suspects.includes(solId));
  const nodes = [['suspect', suspects], ['clue', clues], ['evidence', evidence]];
  return (
    <div className={'board ' + (compact ? 'compact ' : '') + (final ? 'final' : '')}>
      <div className="board-cols mono"><span>SUSPECTS</span><span>CLUES</span><span>EVIDENCE</span></div>
      <div className="board-3d">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="strings">
          {LINKS.map(([a, b], i) => {
            const [x1, y1] = POS[a], [x2, y2] = POS[b], m = (x1 + x2) / 2;
            const on = sel(a) && sel(b), peek = !on && (a === ins || b === ins);
            const done = final && state.result?.solved && chain(a);
            const cls = done ? 'done' : on ? 'on' : peek ? 'peek' : '';
            return <path key={i + cls} className={'str ' + cls} pathLength="1" d={`M${x1} ${y1} C${m} ${y1} ${m} ${y2} ${x2} ${y2}`} />;
          })}
        </svg>
        {nodes.map(([t, list]) => list.map((it) => {
          const k = t + ':' + it.id, [x, y] = POS[k], s = sel(k);
          return (
            <button key={k} className={`bn ${t} ${s ? 'sel' : ''} ${ins === k ? 'insp' : ''}`} style={{ left: x + '%', top: y + '%' }}
              onClick={() => { inspect(t, it.id); onNode?.(t, it.id); }} aria-label={it.name || it.title}>
              {s && <em className="pin" />}<b className="mono">{it.code}</b><span>{label(t, it)}</span>
            </button>
          );
        }))}
      </div>
    </div>
  );
}
