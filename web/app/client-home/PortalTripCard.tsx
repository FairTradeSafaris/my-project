"use client";

import { useMemo, useRef, useState } from "react";
import { authFetch } from "@/lib/authFetch";
import {
  GROUP_ORDER,
  dedupeFiles,
  fileUrl,
  groupOf,
  prettySize,
  type FileGroup,
  type PortalFile,
  type PortalFileField,
  type PortalFileRaw,
} from "./portalFiles";

export type PortalTrip = {
  _id: string;
  title: string;
  startDate?: string;
  endDate?: string;
  destination?: { name?: string; slug?: string } | null;
  documents?: PortalFileRaw[] | null;
  passportUploads?: PortalFileRaw[] | null;
  flightTicketUploads?: PortalFileRaw[] | null;
};

type Toast = { kind: "ok" | "err"; text: string } | null;

function fmtDate(d?: string) {
  if (!d) return "";
  const dt = new Date(d);
  return isNaN(dt.getTime())
    ? ""
    : dt.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function withNames(list: PortalFileRaw[] | null | undefined, field: PortalFileField, fallback: string): PortalFile[] {
  return (Array.isArray(list) ? list : [])
    .filter((f) => f && f._key)
    .map((f, i) => ({ ...f, field, displayName: f.name || f.label || `${fallback} ${i + 1}` }));
}

async function openFile(tripId: string, f: PortalFile) {
  const url = fileUrl(tripId, f.field, f._key);
  const win = window.open("", "_blank");
  try {
    const res = await authFetch(url);
    if (!res.ok) throw new Error(String(res.status));
    const blob = await res.blob();
    const obj = URL.createObjectURL(blob);
    if (win) {
      win.location.href = obj;
    } else {
      const a = document.createElement("a");
      a.href = obj;
      a.download = f.displayName;
      a.click();
    }
    setTimeout(() => URL.revokeObjectURL(obj), 60_000);
  } catch {
    // Fall back to the cookie-authenticated link
    if (win) win.location.href = url;
    else window.location.href = url;
  }
}

function FileIcon({ mime }: { mime?: string | null }) {
  const isImg = mime?.startsWith("image/");
  return (
    <span
      aria-hidden
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#efe5d6] text-[11px] font-semibold uppercase tracking-wide text-accent"
    >
      {isImg ? "IMG" : "PDF"}
    </span>
  );
}

function FileRow({
  tripId,
  f,
  onDelete,
  busy,
}: {
  tripId: string;
  f: PortalFile;
  onDelete?: () => void;
  busy?: boolean;
}) {
  return (
    <li className="flex items-center gap-3 py-2.5">
      <FileIcon mime={f.mimeType} />
      <button
        type="button"
        onClick={() => openFile(tripId, f)}
        className="min-w-0 flex-1 text-left"
      >
        <span className="block truncate text-sm font-medium text-[#3e2a20] hover:underline underline-offset-2">
          {f.displayName}
        </span>
        {prettySize(f.size) && (
          <span className="text-xs text-[#8a7766]">{prettySize(f.size)}</span>
        )}
      </button>
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          disabled={busy}
          className="rounded-md px-2 py-1 text-xs font-medium text-[#a1442f] hover:bg-[#f6e3dc] disabled:opacity-50"
        >
          {busy ? "Removing…" : "Remove"}
        </button>
      )}
    </li>
  );
}

function UploadBox({
  label,
  hint,
  multiple,
  uploading,
  onFiles,
}: {
  label: string;
  hint: string;
  multiple?: boolean;
  uploading: string | null;
  onFiles: (files: File[]) => void;
}) {
  const ref = useRef<HTMLInputElement | null>(null);
  const [over, setOver] = useState(false);
  const busy = uploading !== null;
  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        if (busy) return;
        const files = Array.from(e.dataTransfer.files || []);
        if (files.length) onFiles(multiple ? files : files.slice(0, 1));
      }}
      className={`relative flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed px-4 py-3.5 transition ${
        over ? "border-accent bg-[#efe5d6]" : "border-border bg-white hover:border-accent"
      } ${busy ? "cursor-wait opacity-80" : ""}`}
    >
      <input
        ref={ref}
        type="file"
        accept=".pdf,image/*"
        multiple={multiple}
        disabled={busy}
        className="sr-only"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length) onFiles(files);
          if (ref.current) ref.current.value = "";
        }}
      />
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-lg text-white" aria-hidden>
        {busy ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          "+"
        )}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-[#3e2a20]">{label}</span>
        <span className="block truncate text-xs text-[#8a7766]">
          {busy ? `Uploading ${uploading}…` : hint}
        </span>
      </span>
    </label>
  );
}

export default function PortalTripCard({
  trip,
  onChanged,
}: {
  trip: PortalTrip;
  onChanged: () => Promise<void>;
}) {
  const [uploading, setUploading] = useState<Record<string, string | null>>({});
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast>(null);
  const [openGroup, setOpenGroup] = useState<FileGroup | "all">("all");

  const docs = useMemo(() => dedupeFiles(withNames(trip.documents, "documents", "Document")), [trip.documents]);
  const grouped = useMemo(() => {
    const m = new Map<FileGroup, PortalFile[]>();
    for (const d of docs) {
      const g = groupOf(d.displayName);
      m.set(g, [...(m.get(g) || []), d]);
    }
    return GROUP_ORDER.filter((g) => m.has(g)).map((g) => [g, m.get(g)!] as const);
  }, [docs]);

  const passports = useMemo(() => withNames(trip.passportUploads, "passportUploads", "Passport"), [trip.passportUploads]);
  const flights = useMemo(() => withNames(trip.flightTicketUploads, "flightTicketUploads", "Flight ticket"), [trip.flightTicketUploads]);

  function flash(t: Toast) {
    setToast(t);
    setTimeout(() => setToast(null), 4000);
  }

  async function upload(field: "passportUploads" | "flightTicketUploads", files: File[]) {
    let ok = 0;
    for (const file of files) {
      if (file.size > 4 * 1024 * 1024) {
        flash({ kind: "err", text: `${file.name} is too big. Please keep files under 4 MB (try a PDF or a smaller photo).` });
        continue;
      }
      setUploading((u) => ({ ...u, [field]: file.name }));
      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("tripId", trip._id);
        fd.append("field", field);
        const res = await authFetch("/api/upload", { method: "POST", body: fd });
        if (!res.ok) throw new Error(String(res.status));
        ok++;
      } catch {
        flash({ kind: "err", text: `Couldn’t upload ${file.name}. Please try again.` });
      }
    }
    setUploading((u) => ({ ...u, [field]: null }));
    if (ok) {
      await onChanged();
      flash({ kind: "ok", text: ok === 1 ? "Uploaded. Thank you!" : `${ok} files uploaded. Thank you!` });
    }
  }

  async function remove(field: "passportUploads" | "flightTicketUploads", f: PortalFile) {
    if (!window.confirm(`Remove “${f.displayName}”? This cannot be undone.`)) return;
    setDeleting(f._key);
    try {
      const res = await authFetch("/api/delete-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId: trip._id, field, key: f._key, originalFilename: f.name || undefined }),
      });
      if (!res.ok) throw new Error(String(res.status));
      await onChanged();
      flash({ kind: "ok", text: "File removed." });
    } catch {
      flash({ kind: "err", text: "Couldn’t remove that file. Please try again." });
    } finally {
      setDeleting(null);
    }
  }

  const dates = [fmtDate(trip.startDate), fmtDate(trip.endDate)].filter(Boolean).join(" – ");
  const shownGroups = openGroup === "all" ? grouped : grouped.filter(([g]) => g === openGroup);

  return (
    <li className="overflow-hidden rounded-2xl border border-border/70 bg-[#fffaf3] shadow-[0_1px_0_rgba(93,64,55,0.06),0_8px_24px_-12px_rgba(93,64,55,0.25)]">
      <header className="border-b border-border/60 bg-[#efe5d6]/60 px-5 py-4 sm:px-7">
        <h3 className="text-xl font-semibold leading-tight sm:text-2xl text-accent">{trip.title}</h3>
        <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#6b5647]">
          {dates && <span>{dates}</span>}
          {trip.destination?.name && <span>{trip.destination.name}</span>}
        </p>
      </header>

      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-5">
        {/* Travel documents from the team */}
        <section className="lg:col-span-3">
          <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a7766]">Your travel documents</h4>
          {docs.length === 0 ? (
            <p className="mt-3 rounded-xl bg-white px-4 py-5 text-sm text-[#6b5647]">
              Your documents will appear here once our team has prepared them.
            </p>
          ) : (
            <>
              {grouped.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {(["all", ...grouped.map(([g]) => g)] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setOpenGroup(g)}
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition ${
                        openGroup === g ? "bg-accent text-white" : "bg-white text-[#5d4037] ring-1 ring-border hover:ring-accent"
                      }`}
                    >
                      {g === "all" ? `All (${docs.length})` : g}
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-3 space-y-4">
                {shownGroups.map(([g, list]) => (
                  <div key={g} className="rounded-xl bg-white px-4 py-2 ring-1 ring-border/50">
                    <p className="pt-2 text-sm font-semibold text-accent">
                      {g} <span className="font-normal text-[#8a7766]">· {list.length}</span>
                    </p>
                    <ul className="divide-y divide-[#efe5d6]">
                      {list.map((f) => (
                        <FileRow key={f._key} tripId={trip._id} f={f} />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Client uploads */}
        <section className="lg:col-span-2">
          <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a7766]">Send us your documents</h4>
          <p className="mt-1 text-xs text-[#8a7766]">PDF or photo, up to 4 MB. Only you and our team can see these.</p>

          <div className="mt-3 space-y-5">
            {(
              [
                { field: "passportUploads", label: "Passport", hint: "Photo page of each traveller’s passport", list: passports, multiple: false },
                { field: "flightTicketUploads", label: "Flight ticket", hint: "E-tickets or booking confirmations", list: flights, multiple: true },
              ] as const
            ).map((u) => (
              <div key={u.field}>
                <UploadBox
                  label={u.label}
                  hint={u.hint}
                  multiple={u.multiple}
                  uploading={uploading[u.field] ?? null}
                  onFiles={(files) => upload(u.field, files)}
                />
                {u.list.length > 0 && (
                  <ul className="mt-1 divide-y divide-[#efe5d6] px-1">
                    {u.list.map((f) => (
                      <FileRow
                        key={f._key}
                        tripId={trip._id}
                        f={f}
                        busy={deleting === f._key}
                        onDelete={() => remove(u.field, f)}
                      />
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
        {toast && (
          <div
            className={`pointer-events-auto rounded-full px-5 py-2.5 text-sm font-medium shadow-lg ${
              toast.kind === "ok" ? "bg-accent text-white" : "bg-[#a1442f] text-white"
            }`}
          >
            {toast.text}
          </div>
        )}
      </div>
    </li>
  );
}
