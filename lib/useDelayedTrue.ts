import { useEffect, useState } from "react";

/** true только если value держится дольше delayMs — для подсказки «медленный интернет». */
export function useDelayedTrue(value: boolean, delayMs = 1600): boolean {
  const [delayed, setDelayed] = useState(false);

  useEffect(() => {
    if (!value) return;
    const timer = setTimeout(() => setDelayed(true), delayMs);
    return () => {
      clearTimeout(timer);
      setDelayed(false);
    };
  }, [value, delayMs]);

  return value && delayed;
}
