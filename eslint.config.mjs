import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Node-side tooling: CommonJS build and QA scripts, not app code. They are
    // run by `node` directly and never bundled.
    "scripts/**",
    // Same: a plain CommonJS entry point for the host, where `require()` is
    // correct and the TypeScript rules do not apply. It was failing
    // `npm run lint` with two no-require-imports errors.
    "server.js",
  ]),
]);

export default eslintConfig;
