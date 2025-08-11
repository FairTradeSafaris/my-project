// lib/events.ts
export const OPEN_SEARCH_SHEET = "fts:open-search-sheet";
export const OPEN_BOOK_SHEET = "fts:open-book-sheet";

// (optional helpers)
export const openSearchSheet = () =>
  window.dispatchEvent(new CustomEvent(OPEN_SEARCH_SHEET));
export const openBookSheet = () =>
  window.dispatchEvent(new CustomEvent(OPEN_BOOK_SHEET));
