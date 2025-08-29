// components/PortableTextRenderer.tsx

import { PortableText, PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

// Define custom table block type (if used)
type TableBlock = {
  _type: "table";
  rows: { cells: string[] }[];
};

// PortableText component mappings
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-4">{children}</p>,
  },
  marks: {
    link: ({ children, value }) => {
      const target = (value?.href || "").startsWith("http")
        ? "_blank"
        : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          className="text-blue-600 underline"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    table: ({ value }: { value: TableBlock }) => {
      if (!value?.rows) return null;
      return (
        <div className="overflow-x-auto my-4">
          <table className="min-w-full border border-gray-300 text-sm text-left">
            <tbody className="divide-y divide-gray-200">
              {value.rows.map((row, i) => (
                <tr
                  key={i}
                  className={i === 0 ? "font-semibold bg-gray-100" : ""}
                >
                  {row.cells.map((cell, j) => (
                    <td
                      key={j}
                      className="px-4 py-2 border border-gray-300 break-words whitespace-normal"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
  },
};

// ✅ Export the properly typed component
export default function PortableTextRenderer({
  value,
}: {
  value: PortableTextBlock[];
}) {
  return <PortableText value={value} components={components} />;
}
