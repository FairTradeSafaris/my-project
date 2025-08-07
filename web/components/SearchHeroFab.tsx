"use client";

import { Search } from "lucide-react";

export default function SearchHeroFab({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-5 py-3 rounded-xl bg-[#E5CBA2] text-[#3A2E1F] hover:bg-[#e0c197] transition-all shadow-md ring-1 ring-black/10 flex items-center justify-center gap-2 font-semibold text-sm"
    >
      <Search className="w-4 h-4 -ml-1" strokeWidth={2} />
      <span className="pt-[1px]">Start My Safari</span>
    </button>
  );
}
