"use client";

import { useEffect, useState } from "react";

const FALLBACK = ["cute.", "elegant.", "unique.", "yourself."];

export function RotatingHeadline({
  prefix,
  words,
}: {
  prefix: string;
  words: string[];
}) {
  const list = words.length > 0 ? words : FALLBACK;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % list.length);
    }, 2200);
    return () => window.clearInterval(id);
  }, [list.length]);

  return (
    <h1 className="max-w-3xl text-[clamp(1.5rem,5vw+0.75rem,2.25rem)] font-semibold leading-[1.12] tracking-tight text-[#19371E] sm:text-5xl sm:leading-[1.08]">
      <span className="text-balance">{prefix}</span>
      <span className="relative inline-block min-h-[1.2em] min-w-[5.5ch] align-bottom text-[#2d5a36] sm:min-w-[6.5ch]">
        <span key={list[index]} className="recchi-word-pop inline-block font-semibold text-[#3d7a4a]">
          {list[index]}
        </span>
      </span>
    </h1>
  );
}
