"use client";
// components/ambassador/QrCode.tsx (batch 24)
// Draws a QR code for the ambassador's link in the browser (no outside
// service), with a "Download QR code" button that saves a crisp PNG.
import { useMemo, useState } from "react";
import qrcodegen from "@/lib/qrcodegen";
import { homeButtonOutline } from "@/components/home/homeStyles";

const INK = "#24170f";

function modules(text: string): boolean[][] {
  const qr = qrcodegen.QrCode.encodeText(text, qrcodegen.QrCode.Ecc.MEDIUM);
  const rows: boolean[][] = [];
  for (let y = 0; y < qr.size; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < qr.size; x++) row.push(qr.getModule(x, y));
    rows.push(row);
  }
  return rows;
}

export default function QrCode({ value, fileName }: { value: string; fileName: string }) {
  const grid = useMemo(() => modules(value), [value]);
  const [note, setNote] = useState("");
  const border = 4;
  const size = grid.length + border * 2;
  const path = useMemo(() => {
    let d = "";
    grid.forEach((row, y) =>
      row.forEach((on, x) => {
        if (on) d += `M${x + border},${y + border}h1v1h-1z`;
      }),
    );
    return d;
  }, [grid]);

  const download = () => {
    try {
      const scale = 16;
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = INK;
      grid.forEach((row, y) =>
        row.forEach((on, x) => {
          if (on) ctx.fillRect((x + border) * scale, (y + border) * scale, scale, scale);
        }),
      );
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setNote("Saved to your downloads.");
    } catch {
      setNote("Sorry, the download didn't work. You can take a screenshot instead.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-xl border border-[#ebe1d3] bg-white p-3">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          width={208}
          height={208}
          role="img"
          aria-label="QR code that opens your personal link"
          shapeRendering="crispEdges"
        >
          <rect width={size} height={size} fill="#ffffff" />
          <path d={path} fill={INK} />
        </svg>
      </div>
      <button type="button" onClick={download} className={homeButtonOutline}>
        Download QR code
      </button>
      <p aria-live="polite" className="min-h-[1.5rem] text-[15px] text-[#5c4a3d]">
        {note}
      </p>
    </div>
  );
}
