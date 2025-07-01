import { PortableTextComponents } from "@portabletext/react";

export const portableTextComponents: PortableTextComponents = {
  types: {},
  block: {
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold mb-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold mb-3">{children}</h3>
    ),
    normal: ({ children }) => <p className="mb-4">{children}</p>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        className="text-blue-600 underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-4">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-4">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="mb-2">{children}</li>,
    number: ({ children }) => <li className="mb-2">{children}</li>,
  },
};
