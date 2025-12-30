import { useState, useEffect, useRef, RefObject, useCallback } from "react";

export function useNotePositions<T extends string>(
  wrapperRef: RefObject<HTMLElement | null>,
  keys: readonly T[],
) {
  const itemRefs = useRef<Record<T, HTMLElement | null>>(
    {} as Record<T, HTMLElement | null>,
  );
  const [positions, setPositions] = useState<Record<T, number>>(
    {} as Record<T, number>,
  );

  const setItemRef = useCallback(
    (key: T) => (el: HTMLElement | null) => {
      itemRefs.current[key] = el;
    },
    [],
  );

  useEffect(() => {
    const calculate = () => {
      if (!wrapperRef.current) return;
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      const newPositions = {} as Record<T, number>;

      for (const key of keys) {
        const el = itemRefs.current[key];
        if (el) {
          const rect = el.getBoundingClientRect();
          newPositions[key] = rect.top - wrapperRect.top;
        }
      }
      setPositions(newPositions);
    };

    calculate();
    window.addEventListener("resize", calculate);
    return () => window.removeEventListener("resize", calculate);
  }, [keys, wrapperRef]);

  return { setItemRef, positions };
}
