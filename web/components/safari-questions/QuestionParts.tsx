// components/safari-questions/QuestionParts.tsx (batch 17)
// Shared pieces for the Safari Questions pages: rich-text styles in the site
// palette, the "Still have a question?" box and the question link list.
import Link from "next/link";
import type { PortableTextComponents } from "@portabletext/react";
import LineArt from "@/components/LineArt";
import ChatButton from "@/components/ChatButton";
import {
  BOOK_CALL_URL,
  QUESTIONS_PATH,
  clipWords,
  shortAnswerOf,
  type SafariQuestionLink,
} from "@/lib/safariQuestions";

export const questionBodyComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-5 text-[17px] leading-[1.8] text-[#4a3527]">{children}</p>
    ),
    // the question is the page's only <h1>
    h1: ({ children }) => (
      <h2 className="mb-4 mt-10 text-2xl font-bold leading-snug text-[#24170f]">{children}</h2>
    ),
    h2: ({ children }) => (
      <h2 className="mb-4 mt-10 text-2xl font-bold leading-snug text-[#24170f]">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 mt-8 text-xl font-semibold text-[#24170f]">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-2 mt-6 text-lg font-semibold text-[#24170f]">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-2 border-[#c9a57f] pl-6 text-lg italic leading-relaxed text-[#5d4037]">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 space-y-2 pl-0 text-[17px] leading-[1.7] text-[#4a3527] [&>li]:relative [&>li]:pl-6 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-[0.7em] [&>li]:before:h-[6px] [&>li]:before:w-[6px] [&>li]:before:rounded-full [&>li]:before:bg-[#c9a57f]">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-6 list-decimal space-y-2 pl-6 text-[17px] leading-[1.7] text-[#4a3527] marker:font-semibold marker:text-[#a0703f]">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-[#24170f]">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => {
      const href: string = value?.href || "#";
      const external = /^https?:\/\//.test(href) && !href.includes("fairtradesafaris.com");
      return (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="font-medium text-[#5d4037] underline decoration-[#c9a57f] decoration-2 underline-offset-4 hover:text-[#24170f]"
        >
          {children}
        </a>
      );
    },
  },
};

export function StillHaveAQuestion({ destinationTitle }: { destinationTitle?: string }) {
  return (
    <section
      aria-labelledby="still-question"
      className="relative isolate overflow-hidden rounded-[28px] bg-[#24170f] px-7 pb-36 pt-10 text-[#fbf6ef] sm:px-12 sm:pb-40 sm:pt-12"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d9b48a]">Talk to a specialist</p>
      <h2 id="still-question" className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">
        Still have a question?
      </h2>
      <p className="mt-4 max-w-xl leading-relaxed text-[#e9dccb]">
        {destinationTitle
          ? `Our specialists plan ${destinationTitle} safaris and are happy to help. Ask us anything, with no obligation.`
          : "Our safari specialists are happy to help with anything you're wondering about. There's no obligation."}
      </p>
      <div className="mt-7 flex flex-wrap gap-3">
        <ChatButton className="inline-flex items-center gap-2 rounded-full bg-[#fbf6ef] px-6 py-3 text-sm font-semibold text-[#24170f] transition hover:bg-[#f3e9dd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9b48a]" />
        <a
          href={BOOK_CALL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-[#d9b48a]/60 px-6 py-3 text-sm font-semibold text-[#fbf6ef] transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9b48a]"
        >
          Book a free call
          <span aria-hidden="true">→</span>
        </a>
      </div>
      <LineArt
        name="savanna"
        className="absolute inset-x-0 bottom-0 -z-10 w-full text-[#d9b48a]/25"
      />
    </section>
  );
}

export function QuestionLinkList({
  items,
  showAnswer = true,
}: {
  items: SafariQuestionLink[];
  showAnswer?: boolean;
}) {
  return (
    <ul className="divide-y divide-[#e6d8c8] border-y border-[#e6d8c8]">
      {items.map((q) => (
        <li key={q._id}>
          <Link
            href={`${QUESTIONS_PATH}/${q.slug}/`}
            className="group flex items-start justify-between gap-6 py-5 transition"
          >
            <span>
              <span className="block text-[17px] font-semibold leading-snug text-[#24170f] transition group-hover:text-[#5d4037]">
                {q.question}
              </span>
              {showAnswer && shortAnswerOf(q) && (
                <span className="mt-1.5 block text-[15px] leading-relaxed text-[#6b5444]">
                  {clipWords(shortAnswerOf(q), 150)}
                </span>
              )}
            </span>
            <span
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-lg text-[#b8916a] transition group-hover:translate-x-1 group-hover:text-[#5d4037]"
            >
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
