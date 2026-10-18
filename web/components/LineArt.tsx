// components/LineArt.tsx (batch 12b)
// Reusable, recolourable line drawings. The SVGs in /public/line-art are
// traced from the site's line-art originals (footer rhino, contact
// wildebeest, team savanna, plus giraffes, elephant under acacia, lions under
// acacia and antelope). Drawn with a CSS mask, so the colour comes from
// the text colour (e.g. className="text-[#5d4037]") and the file is cached
// once for the whole site. Decorative only (hidden from screen readers).
// Traced from the full-resolution originals with a slightly heavier, smoothed
// stroke so lines stay crisp from ~170px wide up to full width.
import type { CSSProperties } from "react";

export const LINE_ART = {
  rhino: { src: "/line-art/rhino.svg", ratio: 1600 / 636 },
  wildebeest: { src: "/line-art/wildebeest.svg", ratio: 1600 / 747 },
  savanna: { src: "/line-art/savanna.svg", ratio: 2000 / 465 },
  giraffes: { src: "/line-art/giraffes.svg", ratio: 1600 / 743 },
  "elephant-acacia": { src: "/line-art/elephant-acacia.svg", ratio: 1600 / 1090 },
  "lions-acacia": { src: "/line-art/lions-acacia.svg", ratio: 1600 / 958 },
  antelope: { src: "/line-art/antelope.svg", ratio: 1200 / 1059 },
} as const;

export type LineArtName = keyof typeof LINE_ART;

export function isLineArtName(v: unknown): v is LineArtName {
  return typeof v === "string" && v in LINE_ART;
}

export default function LineArt({
  name,
  className = "",
  style,
  flip = false,
}: {
  name: LineArtName;
  className?: string;
  style?: CSSProperties;
  flip?: boolean;
}) {
  const art = LINE_ART[name] ?? LINE_ART.rhino;
  const mask = `url(${art.src}) center / contain no-repeat`;
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none block select-none ${className}`}
      style={{
        aspectRatio: String(art.ratio),
        backgroundColor: "currentColor",
        WebkitMask: mask,
        mask,
        transform: flip ? "scaleX(-1)" : undefined,
        ...style,
      }}
    />
  );
}
