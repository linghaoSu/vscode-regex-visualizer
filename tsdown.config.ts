import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  dts: false,
  sourcemap: true,
  // Minification is intentionally disabled: regexper + snapsvg rely on
  // dynamic property names and DOM-class hooks that Rolldown's minifier
  // mangles, which collapses rendered SVGs to zero-size.
  minify: false,
  external: ['vscode'],
});
