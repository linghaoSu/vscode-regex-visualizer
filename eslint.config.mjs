import antfu from '@antfu/eslint-config';

export default antfu({
  typescript: true,
  vue: false,
  react: false,
  jsonc: true,
  yaml: true,
  stylistic: {
    semi: true,
  },
  rules: {
    curly: ['error', 'all'],
  },
  ignores: [
    'dist',
    'node_modules',
    'pnpm-lock.yaml',
    'src/snapsvg/**',
    'src/regexp-visualizer/**',
  ],
});
