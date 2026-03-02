"use client";

type Props = {
  value: string;
  onSearch: (query: string) => void;
};

export default function BlogSearchBar({ value, onSearch }: Props) {
  return (
    <div className="mb-6">
      <input
        type="text"
        value={value ?? ""} // Ensures it's always controlled
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search blog posts..."
        className="w-full px-4 py-2 border rounded"
      />
    </div>
  );
}
