import { useEffect } from 'react';
// Smoothly interpolated pointer parallax. rAF runs only while values are still settling.
export default function useParallax() {
  useEffect(() => {
    const root = document.documentElement;
    let tx = 0, ty = 0, cx = 0, cy = 0, mx = innerWidth / 2, my = innerHeight * 0.4, lx = mx, ly = my, raf = 0;
    const tick = () => {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08; lx += (mx - lx) * 0.1; ly += (my - ly) * 0.1;
      root.style.setProperty('--px', cx.toFixed(3)); root.style.setProperty('--py', cy.toFixed(3));
      root.style.setProperty('--lx', lx.toFixed(1) + 'px'); root.style.setProperty('--ly', ly.toFixed(1) + 'px');
      raf = Math.abs(mx - lx) + Math.abs(my - ly) + Math.abs(tx - cx) * 50 + Math.abs(ty - cy) * 50 > 0.4 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e) => { mx = e.clientX; my = e.clientY; tx = (mx / innerWidth) * 2 - 1; ty = (my / innerHeight) * 2 - 1; if (!raf) raf = requestAnimationFrame(tick); };
    addEventListener('pointermove', move, { passive: true });
    return () => { removeEventListener('pointermove', move); cancelAnimationFrame(raf); };
  }, []);
}
