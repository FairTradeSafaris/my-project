// utils/withSchemas.ts
import type { Metadata } from "next";
import { assembleSchemas } from "./assembleSchemas";
import { jsonLdMetadata } from "./jsonLdMetadata";

/**
 * Merges standard Next.js Metadata with one or more JSON-LD schemas.
 */
export function withSchemas(base: Metadata, ...schemas: unknown[]): Metadata {
  const mergedSchemas = assembleSchemas(schemas);

  return {
    ...base,
    ...jsonLdMetadata(mergedSchemas),
  };
}
