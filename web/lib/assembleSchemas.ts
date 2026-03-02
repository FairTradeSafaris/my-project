// utils/assembleSchemas.ts

/**
 * Takes an array of schema objects and returns a flattened array,
 * removing null/undefined entries and preventing duplicates.
 */
export function assembleSchemas(schemas: unknown[]) {
  return schemas
    .flat()
    .filter(Boolean)
    .map((schema) => JSON.parse(JSON.stringify(schema))); // deep clone to avoid mutations
}
