import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Your existing Next.js and TS config
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // ✅ Custom override to disable TS linting for .cjs files
  {
    files: ["**/*.cjs"],
    languageOptions: {
      sourceType: "commonjs", // Important: tells ESLint this is CommonJS, not ESM
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-var-requires": "off",
    },
  },
];

export default eslintConfig;
