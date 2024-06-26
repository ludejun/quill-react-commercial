import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
// import image from '@rollup/plugin-image';
import path from 'path';
import strip from '@rollup/plugin-strip';
// import url from '@rollup/plugin-url';
import svg from 'rollup-plugin-svg';
import cssOnly from 'rollup-plugin-css-only';
import less from 'rollup-plugin-less';
import css from 'rollup-plugin-import-css';
import replace from '@rollup/plugin-replace';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const pkg = require('./package.json');

export default [
  {
    input: './index.tsx',
    output: {
      file: pkg.main,
      // dir: path.dirname(pkg.main), // 打包输出文件保留原始模块结构
      format: 'esm',
      // name: pkg.name,
      // exports: 'named', // 指定导出模式（自动、默认、命名、无）
      // preserveModules: true, // 保留模块结构
      // preserveModulesRoot: '.', // 将保留的模块放在根级别的此路径下
    },
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs({ transformMixedEsModules: true }),
      // babel(),
      typescript({
        tsconfig: './tsconfig.json'
      }),
      // replace({
      //   "Object.defineProperty(exports, '__esModule', { value: true });": '',
      //   delimiters: ['\n', '\n'],
      // }),
      postcss({
        extract: true,
      }),
      // image(), // 将所有图片打包成base64
      // strip(), // Remove debugger statements and functions like assert.equal and console.log from your code 生产环境打开
      // url(), // 将所有图片打包成js文件
      svg(), // 将svg作为inline打包，dom中直接嵌入svg dom，非base64，采用image/url打成base64有部分图片展示不出来，还需要套img src标签
    ],
  },
  {
    input: './index.tsx',
    output: [
      {
        file: 'dist/quill-react-commercial.min.js',
        format: 'umd',
        sourcemap: true,
        name: 'quillReactCommercial',
      },
      {
        file: 'example/quill-react-commercial.min.js',
        format: 'umd',
        sourcemap: false,
        name: 'quillReactCommercial',
      }, // 给 github actions 和 github pages 使用
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript(),
      postcss({
        extract: true,
      }),
      svg(), // 将svg作为inline打包，dom中直接嵌入svg dom，非base64，采用image/url打成base64有部分图片展示不出来，还需要套img src标签
      terser(),
    ],
  },
];
