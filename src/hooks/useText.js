import { useEffect, useState } from 'react';
const GLYPHS = '█▓▒░#%&@$01<>/\\|+=*';
// Decryption effect: scrambles then resolves left to right.
export function useDecrypt(text, speed = 28) {
  const [out, setOut] = useState(text.replace(/\S/g, '▒'));
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i += 0.7;
      setOut(text.split('').map((c, k) => (c === ' ' || k < i ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join(''));
      if (i >= text.length) { clearInterval(t); setOut(text); }
    }, speed);
    return () => clearInterval(t);
  }, [text, speed]);
  return out;
}
export function useTyped(text, speed = 18) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    const t = setInterval(() => setN((v) => { if (v >= text.length) { clearInterval(t); return v; } return v + 1; }), speed);
    return () => clearInterval(t);
  }, [text, speed]);
  return text.slice(0, n);
}
