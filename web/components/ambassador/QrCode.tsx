"use client";
// components/ambassador/QrCode.tsx (batch 24; batch 26: Share QR code on phones)
// Draws a QR code for the ambassador's link in the browser (no outside
// service), with a "Download QR code" button that saves a crisp PNG.
import { useEffect, useMemo, useState } from "react";
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

export default function QrCode({ value, fileName, shareText }: { value: string; fileName: string; shareText?: string }) {
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

  // batch 26: "Share QR code" only where the phone can share image files.
  const [canShareFile, setCanShareFile] = useState(false);
  useEffect(() => {
    try {
      const probe = new File([new Blob(["x"], { type: "image/png" })], "qr.png", { type: "image/png" });
      setCanShareFile(typeof navigator.share === "function" && !!navigator.canShare?.({ files: [probe] }));
    } catch {
      setCanShareFile(false);
    }
  }, []);

  const drawCanvas = (): HTMLCanvasElement | null => {
    const scale = 16;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = INK;
    grid.forEach((row, y) =>
      row.forEach((on, x) => {
        if (on) ctx.fillRect((x + border) * scale, (y + border) * scale, scale, scale);
      }),
    );
    return canvas;
  };

  const share = async () => {
    try {
      const canvas = drawCanvas();
      if (!canvas) return;
      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
      if (!blob) throw new Error("no image");
      const file = new File([blob], fileName, { type: "image/png" });
      if (!navigator.canShare?.({ files: [file] })) throw new Error("cannot share");
      await navigator.share({ files: [file], title: "Fair Trade Safaris", text: shareText || value });
      setNote("");
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return; // they closed the share menu
      setNote("Sharing didn't work on this device. Please use Download QR code instead.");
    }
  };

  const download = () => {
    try {
      const canvas = drawCanvas();
      if (!canvas) return;
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
      <div className="flex flex-wrap justify-center gap-3">
        {canShareFile && (
          <button type="button" onClick={share} className={homeButtonOutline}>
            Share QR code
          </button>
        )}
        <button type="button" onClick={download} className={homeButtonOutline}>
          Download QR code
        </button>
      </div>
      <p aria-live="polite" className="min-h-[1.5rem] text-[15px] text-[#5c4a3d]">
        {note}
      </p>
    </div>
  );
}
