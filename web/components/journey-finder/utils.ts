export const parseDurationDays = (d?: string) => {
  const m = d?.match(/^(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
};

export const parsePriceNumber = (p: unknown): number => {
  if (typeof p === "number") return p;

  if (typeof p === "string") {
    const n = p.replace(/[^\d.]/g, "");
    const num = parseFloat(n);
    return isNaN(num) ? 0 : num;
  }

  return 0;
};

export const formatMoney = (n: number) =>
  n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

// Safe range clamp: keeps sliders valid across country changes
export const clampRange = (
  value: [number, number],
  bounds: [number, number]
): [number, number] => {
  const [minB, maxB] = bounds;
  let [minV, maxV] = value;
  minV = Math.max(minV, minB);
  maxV = Math.min(maxV, maxB);
  return minV > maxV ? [minB, maxB] : [minV, maxV];
};
