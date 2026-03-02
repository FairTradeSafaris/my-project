// utils/jsonLdMetadata.ts

export function jsonLdMetadata(schemas: unknown[]) {
  return {
    other: {
      "script:ld+json": JSON.stringify(
        schemas.length === 1 ? schemas[0] : schemas
      ),
    },
  };
}
