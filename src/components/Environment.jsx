import { memo, useMemo } from 'react';
const rnd = (seed) => { let s = seed; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); };
const OBJECTS = [
  { c: 'o-doc', x: '6%', y: '18%', z: -80, d: 26, b: 1, t: 10 }, { c: 'o-folder', x: '84%', y: '14%', z: 40, d: 44, t: 11, dl: -3 },
  { c: 'o-photo', x: '90%', y: '58%', z: -160, d: 18, b: 2, t: 12 }, { c: 'o-screen', x: '3%', y: '62%', z: 60, d: 40, t: 13, dl: -5 },
  { c: 'o-mag', x: '74%', y: '74%', z: 120, d: 56, t: 9, dl: -2 }, { c: 'o-doc', x: '46%', y: '8%', z: -240, d: 12, b: 3, t: 14, dl: -6 },
  { c: 'o-photo', x: '22%', y: '78%', z: -40, d: 30, t: 12, dl: -1 }, { c: 'o-marker', x: '62%', y: '30%', z: 160, d: 60, t: 8, dl: -4 },
  { c: 'o-folder', x: '30%', y: '40%', z: -300, d: 8, b: 3, o: 0.5, t: 15 }, { c: 'o-screen', x: '56%', y: '84%', z: -120, d: 20, b: 1, t: 11, dl: -7 },
];
function Environment() {
  const parts = useMemo(() => { const r = rnd(7); return Array.from({ length: 34 }, (_, i) => ({ x: r() * 100 + '%', s: (i % 4 === 0 ? 3 : 1.5 + r()) + 'px', dur: 12 + r() * 16 + 's', delay: -r() * 24 + 's', dr: (r() - 0.5) * 120 + 'px', c: i % 3 === 0 ? '#FF4B5C' : i % 3 === 1 ? '#7DB8FF' : '#D9A441' })); }, []);
  return (
    <div className="env" aria-hidden="true">
      <div className="env-back" /><div className="env-floor" /><div className="env-glow" /><div className="env-sweep" /><div className="scan" />
      {OBJECTS.map((o, i) => (
        <div className="fo" key={i} style={{ '--x': o.x, '--y': o.y, '--z': o.z + 'px', '--d': o.d, '--b': (o.b || 0) + 'px', '--o': o.o || 0.85, '--t': o.t + 's', '--dl': (o.dl || 0) + 's' }}>
          <i className={o.c}>{o.c === 'o-marker' ? '3' : null}</i>
        </div>
      ))}
      {parts.map((p, i) => <span className="pt" key={i} style={{ '--x': p.x, '--s': p.s, '--dur': p.dur, '--delay': p.delay, '--dr': p.dr, '--c': p.c }} />)}
      <div className="vignette" />
    </div>
  );
}
export default memo(Environment);
