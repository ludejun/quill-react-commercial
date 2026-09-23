import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import svg from 'rollup-plugin-svg';
import terser from '@rollup/plugin-terser';

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const pkg = require('./package.json');

/**
 * Runtime dependencies stay external in the ESM build so consumers end up with
 * a single copy of quill / quill-delta / highlight.js instead of one bundled
 * per package. Sub-path imports (`highlight.js/lib/core`) have to match too.
 */
const externalPackages = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
];
// Assets pulled out of those packages (quill's toolbar icons, its stylesheet)
// still have to be inlined: consumers cannot be expected to wire up an SVG or
// LESS loader for files that live inside node_modules.
const isAsset = (id) => /\.(svg|css|less|png|jpe?g|gif)$/i.test(id);
const isExternal = (id) =>
  !isAsset(id) &&
  externalPackages.some((name) => id === name || id.startsWith(`${name}/`));

/**
 * `@rollup/plugin-typescript` derives `outDir` from the output directory, so
 * each config needs its own plugin instance with a single output.
 */
const plugins = (outDir, { minify = false } = {}) => [
  resolve(),
  commonjs({ transformMixedEsModules: true }),
  typescript({ tsconfig: './tsconfig.json', compilerOptions: { outDir } }),
  postcss({ extract: true }),
  // Inline SVG as DOM rather than base64: some icons do not render when they
  // go through @rollup/plugin-url or plugin-image.
  svg(),
  ...(minify ? [terser()] : []),
];

export default [
  // ESM build, consumed as `import RichTextEditor from 'quill-react-commercial'`
  {
    input: './index.tsx',
    output: { file: pkg.main, format: 'esm', sourcemap: true },
    external: isExternal,
    plugins: plugins('lib'),
  },
  // Standalone UMD build for <script> usage; `build:example` copies it into
  // example/ for the GitHub Pages demo.
  {
    input: './index.tsx',
    output: {
      file: 'dist/quill-react-commercial.min.js',
      format: 'umd',
      sourcemap: true,
      name: 'quillReactCommercial',
      globals: { react: 'React', 'react-dom': 'ReactDOM' },
    },
    plugins: [peerDepsExternal(), ...plugins('dist', { minify: true })],
  },
];
