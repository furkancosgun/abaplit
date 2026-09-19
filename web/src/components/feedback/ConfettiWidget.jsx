import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function ConfettiWidget({ type }) {
  useEffect(() => {
    if (type === 'balloons') {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.7 },
      });
    } else if (type === 'snow') {
      confetti({
        particleCount: 120,
        spread: 120,
        startVelocity: 15,
        origin: { y: 0 },
      });
    }
  }, [type]);

  return null;
}
