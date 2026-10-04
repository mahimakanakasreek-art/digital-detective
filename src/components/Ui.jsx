import { useRef } from 'react';
import { useDecrypt, useTyped } from '../hooks/useText';
import useReveal from '../hooks/useReveal';

export const Decrypt = ({ text, speed }) => <>{useDecrypt(text, speed)}</>;
export const Typed = ({ text, speed }) => <>{useTyped(text, speed)}<span className="caret" /></>;

export function Reveal({ children, className = '', delay = 0, as: Tag = 'div', ...p }) {
  const ref = useReveal();
  return <Tag ref={ref} className={'rv ' + className} style={{ '--rd': delay + 'ms' }} {...p}>{children}</Tag>;
}

// Card that tilts toward the cursor and lifts on hover.
export function TiltCard({ as: Tag = 'div', className = '', max = 9, children, ...p }) {
  const ref = useRef(null);
  const move = (e) => {
    const el = ref.current, r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--ry', x * max + 'deg'); el.style.setProperty('--rx', -y * max + 'deg');
    el.style.setProperty('--gx', (x + 0.5) * 100 + '%'); el.style.setProperty('--gy', (y + 0.5) * 100 + '%');
  };
  const leave = () => { const s = ref.current.style; s.setProperty('--rx', '0deg'); s.setProperty('--ry', '0deg'); };
  return <Tag ref={ref} className={'tilt ' + className} onPointerMove={move} onPointerLeave={leave} {...p}>{children}</Tag>;
}

// Magnetic button: leans toward the cursor and makes the environment glow.
export function MagneticButton({ children, primary, className = '', onClick, disabled, ...p }) {
  const ref = useRef(null);
  const move = (e) => {
    if (disabled) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--mx', (e.clientX - r.left - r.width / 2) * 0.22 + 'px');
    ref.current.style.setProperty('--my', (e.clientY - r.top - r.height / 2) * 0.32 + 'px');
    document.body.classList.add('hot');
  };
  const leave = () => { ref.current.style.setProperty('--mx', '0px'); ref.current.style.setProperty('--my', '0px'); document.body.classList.remove('hot'); };
  return (
    <button ref={ref} disabled={disabled} className={'mbtn ' + (primary ? 'primary ' : '') + className} onClick={onClick} onPointerMove={move} onPointerLeave={leave} {...p}>
      <span>{children}</span>
    </button>
  );
}

export const Panel = ({ title, tag, children, className = '' }) => (
  <section className={'panel ' + className}>
    {title && <h3 className="ph mono"><i className="dot blue blink" />{title}{tag && <em>{tag}</em>}</h3>}
    {children}
  </section>
);
