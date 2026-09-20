import { useEffect, useRef } from 'react';

export default function AutorefreshWidget({ node, onEvent, isRunning }) {
  const { interval = 3000, max_iterations, event = '' } = node;
  const intervalMs = Math.max(500, parseInt(interval, 10) || 3000);
  const maxCount = max_iterations ? parseInt(max_iterations, 10) : Infinity;

  const countRef = useRef(0);
  const isRunningRef = useRef(isRunning);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    countRef.current = 0;
    const timerId = setInterval(() => {
      if (isRunningRef.current) return;
      if (countRef.current >= maxCount) {
        clearInterval(timerId);
        return;
      }
      countRef.current += 1;
      if (onEvent) {
        onEvent(event, []);
      }
    }, intervalMs);

    return () => clearInterval(timerId);
  }, [intervalMs, maxCount, event, onEvent]);

  return null;
}
