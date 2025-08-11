// components/filters/BlogFilters.tsx
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { client as sanity } from "@/lib/sanity";

type Option = { title: string };

function useQueryState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const set = useCallback(
    (
      patch: Record<string, string | null | undefined>,
      opts?: { replace?: boolean }
    ) => {
      const sp = new URLSearchParams(searchParams?.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v === null || v === undefined || v === "") sp.delete(k);
        else sp.set(k, String(v));
      }
      const url = `${pathname}?${sp.toString()}`;
      if (opts?.replace) {
        router.replace(url, { scroll: false });
      } else {
        router.push(url, { scroll: false });
      }
    },
    [pathname, router, searchParams]
  );

  const get = useCallback(
    (k: string) => searchParams?.get(k) ?? "",
    [searchParams]
  );

  return { get, set, all: searchParams };
}

export default function BlogFilters() {
  const { get, set, all } = useQueryState();
  const [isPending, startTransition] = useTransition();
  const applyBtnRef = useRef<HTMLButtonElement>(null);

  // Remote data
  const [tags, setTags] = useState<Option[]>([]);
  const [authors, setAuthors] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  // Local UI state mirrors URL params
  const [tag, setTag] = useState(get("tag"));
  const [author, setAuthor] = useState(get("author"));
  const [yearFrom, setYearFrom] = useState(get("from"));
  const [yearTo, setYearTo] = useState(get("to"));
  const [sort, setSort] = useState(get("sort") || "newest"); // newest|oldest

  // Keep local in sync with URL (back/forward etc.)
  useEffect(() => {
    setTag(get("tag"));
    setAuthor(get("author"));
    setYearFrom(get("from"));
    setYearTo(get("to"));
    setSort(get("sort") || "newest");
  }, [all, get]);

  // Fetch unique tags and authors from Sanity posts
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [tagData, authorData]: [string[], string[]] = await Promise.all([
          // tags: could be array<string> on post.tags OR categories->title; adjust if needed
          sanity.fetch(
            `array::unique(
              *[_type=="post" && defined(tags)][].tags[]
            )`
          ),
          // authors by name
          sanity.fetch(
            `array::unique(
              *[_type=="post" && defined(author->name)].author->name
            )`
          ),
        ]);

        if (cancelled) return;

        const toOpts = (arr: string[]) =>
          (arr || [])
            .map((t) => String(t).trim())
            .filter(Boolean)
            .sort((a, b) => a.localeCompare(b))
            .map((title) => ({ title }));

        setTags(toOpts(tagData || []));
        setAuthors(toOpts(authorData || []));
      } catch (err) {
        console.error("BlogFilters: fetch failed", err);
        if (!cancelled) {
          setTags([]);
          setAuthors([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const parseYear = (v: string): string => {
    const n = Number(v);
    const year = Number.isFinite(n) ? Math.floor(n) : NaN;
    return year >= 1900 && year <= 3000 ? String(year) : "";
  };

  const apply = useCallback(() => {
    startTransition(() => {
      set(
        {
          tag: tag || null,
          author: author || null,
          from: parseYear(yearFrom) || null,
          to: parseYear(yearTo) || null,
          sort: sort && sort !== "newest" ? sort : null, // default is newest; drop param if newest
          open: null,
          page: null,
        },
        { replace: true }
      );
    });
  }, [author, set, sort, tag, yearFrom, yearTo]);

  const clear = useCallback(() => {
    setTag("");
    setAuthor("");
    setYearFrom("");
    setYearTo("");
    setSort("newest");

    startTransition(() => {
      set(
        {
          tag: null,
          author: null,
          from: null,
          to: null,
          sort: null,
          open: null,
          page: null,
        },
        { replace: true }
      );
    });
  }, [set]);

  const hasActive = useMemo(
    () =>
      Boolean(
        tag ||
          author ||
          yearFrom ||
          yearTo ||
          (get("sort") && get("sort") !== "newest")
      ),
    [author, get, tag, yearFrom, yearTo]
  );

  return (
    <section
      className="mx-auto w-full max-w-5xl rounded-2xl bg-white/90 p-3 shadow-lg backdrop-blur text-neutral-900"
      aria-busy={loading || isPending}
    >
      <form
        className="grid grid-cols-2 gap-3 md:grid-cols-6"
        onSubmit={(e) => {
          e.preventDefault();
          apply();
        }}
      >
        {/* Tag */}
        <label className="col-span-2 flex flex-col text-xs">
          <span className="mb-1 font-medium text-neutral-700">Tag</span>
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none"
            disabled={loading}
            aria-label="Tag"
          >
            <option value="">All tags</option>
            {tags.map((t) => (
              <option key={t.title} value={t.title}>
                {t.title}
              </option>
            ))}
          </select>
        </label>

        {/* Author */}
        <label className="col-span-2 flex flex-col text-xs">
          <span className="mb-1 font-medium text-neutral-700">Author</span>
          <select
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none"
            disabled={loading}
            aria-label="Author"
          >
            <option value="">All authors</option>
            {authors.map((a) => (
              <option key={a.title} value={a.title}>
                {a.title}
              </option>
            ))}
          </select>
        </label>

        {/* Year From */}
        <label className="col-span-1 flex flex-col text-xs">
          <span className="mb-1 font-medium text-neutral-700">Year (from)</span>
          <input
            type="number"
            inputMode="numeric"
            value={yearFrom}
            onChange={(e) => setYearFrom(e.target.value)}
            placeholder="e.g. 2022"
            className="rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none"
            aria-label="From year"
          />
        </label>

        {/* Year To */}
        <label className="col-span-1 flex flex-col text-xs">
          <span className="mb-1 font-medium text-neutral-700">Year (to)</span>
          <input
            type="number"
            inputMode="numeric"
            value={yearTo}
            onChange={(e) => setYearTo(e.target.value)}
            placeholder="e.g. 2024"
            className="rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none"
            aria-label="To year"
          />
        </label>

        {/* Sort */}
        <label className="col-span-2 flex flex-col text-xs">
          <span className="mb-1 font-medium text-neutral-700">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none"
            aria-label="Sort order"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>

        {/* Actions */}
        <div className="col-span-2 md:col-span-6 mt-3 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={clear}
            disabled={!hasActive || isPending}
            className="rounded-xl border border-neutral-300 px-4 py-2 text-sm disabled:opacity-50"
          >
            Clear
          </button>
          <button
            ref={applyBtnRef}
            type="submit"
            disabled={isPending}
            className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white active:scale-95 disabled:opacity-70"
          >
            {isPending ? "Applying…" : "Apply filters"}
          </button>
        </div>
      </form>
    </section>
  );
}
