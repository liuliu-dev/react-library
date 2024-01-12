import { useEffect, useState } from "react";
import useEffectOnMount from "./useEffectOnMount";

export function useReactiveHeight<E extends HTMLElement>(): E["clientHeight"] {
  const [clientHeight, setClientHeight] = useState(0);

  useEffectOnMount(() => {
    setClientHeight(window.innerHeight);
    const handleResize = () => setClientHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  return clientHeight;
}

export function useReactiveWidth<E extends HTMLElement>(
  mobileBreakpoint = 768,
): { clientWidth: E["clientWidth"]; isMobile: boolean } {
  const [clientWidth, setClientWidth] = useState(0);

  useEffectOnMount(() => {
    setClientWidth(window.innerWidth);
    const handleResize = () => setClientWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  const isMobile = !(clientWidth >= mobileBreakpoint);

  return { clientWidth, isMobile };
}

// TODO: This is broken
export function useReactiveScrollWidth<E extends HTMLElement>(
  elem?: E | null,
): { scrollWidth: E["scrollWidth"]; windowInnerWidth: Window["innerWidth"] } {
  const [scrollWidth, setScrollWidth] = useState(elem?.scrollWidth ?? 0);
  const [windowInnerWidth, setWindowInnerWidth] = useState(window.innerWidth);

  useEffectOnMount(() => {
    const handleResize = () => {
      setScrollWidth(elem?.scrollWidth ?? 0);
      setWindowInnerWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  useEffect(() => {
    if (elem) {
      setScrollWidth(elem.scrollWidth);
    }
  }, [elem]);

  return { scrollWidth, windowInnerWidth };
}
