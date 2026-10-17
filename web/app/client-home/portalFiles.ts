// Client-side helpers for the portal file list (display only, no writes).

export type PortalFileField = "documents" | "passportUploads" | "flightTicketUploads";

export type PortalFileRaw = {
  _key: string;
  name?: string | null;
  label?: string | null;
  mimeType?: string | null;
  size?: number | null;
  assetId?: string | null;
  zohoAttachmentId?: string | null;
};

export type PortalFile = PortalFileRaw & { field: PortalFileField; displayName: string };

export type FileGroup = "Itinerary" | "Flights" | "Invoices" | "Checklists & info" | "Other";
export const GROUP_ORDER: FileGroup[] = [
  "Itinerary",
  "Flights",
  "Invoices",
  "Checklists & info",
  "Other",
];

/** Hide repeats: same Zoho attachment id, else same name + size, else same asset. */
export function dedupeFiles(files: PortalFile[]): PortalFile[] {
  const seen = new Set<string>();
  const out: PortalFile[] = [];
  for (const f of files) {
    const keys: string[] = [];
    if (f.zohoAttachmentId) keys.push(`z:${f.zohoAttachmentId}`);
    if (f.assetId) keys.push(`a:${f.assetId}`);
    const n = f.displayName.trim().toLowerCase();
    if (n) keys.push(`n:${n}|${f.size ?? "?"}`);
    if (keys.some((k) => seen.has(k))) continue;
    keys.forEach((k) => seen.add(k));
    out.push(f);
  }
  return out;
}

export function groupOf(name: string): FileGroup {
  const n = name.toLowerCase();
  if (/itinerar|programme|day.?by.?day|safari plan/.test(n)) return "Itinerary";
  if (/invoice|receipt|payment|quote|quotation|statement|deposit|proforma|pro-forma/.test(n)) return "Invoices";
  if (/flight|ticket|e-?ticket|boarding|airline|airways|\bair\b|\bjhb\b|\bjnb\b|transfer/.test(n)) return "Flights";
  if (/checklist|packing|info|guide|visa|insurance|health|medical|terms|conditions|faq|welcome|tips/.test(n)) return "Checklists & info";
  if (/experience|safari|tour|journey|adventure|holiday|program|\(final\)/.test(n)) return "Itinerary";
  return "Other";
}

export function prettySize(bytes?: number | null): string {
  if (!bytes || bytes <= 0) return "";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function fileUrl(tripId: string, field: PortalFileField, key: string, download = false) {
  const q = new URLSearchParams({ trip: tripId, field, key });
  if (download) q.set("download", "1");
  return `/api/portal-file?${q.toString()}`;
}
