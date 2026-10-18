"use client";
// Batch 17: a "Chat with us" button that can sit anywhere on a page. It asks
// the existing chat launcher (components/consent/ChatLauncher.tsx) to open
// Zoho SalesIQ, which works with or without cookie consent. If the chat isn't
// available on this page, it goes to the contact page instead.
export const OPEN_CHAT_EVENT = "fts:open-chat";

export default function ChatButton({
  className = "",
  children = "Chat with us",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const open = () => {
    const detail = { handled: false };
    window.dispatchEvent(new CustomEvent(OPEN_CHAT_EVENT, { detail }));
    if (!detail.handled) window.location.href = "/contact/";
  };
  return (
    <button type="button" onClick={open} className={className}>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
      </svg>
      {children}
    </button>
  );
}
