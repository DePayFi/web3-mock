import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import sucrase from '@rollup/plugin-sucrase';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.js',
  output: [
    {
      format: 'cjs',
      globals: {
        'ethers': 'ethers'
      },
      file: 'dist/cjs/index.js'
    },
    {
      format: 'es',
      globals: {
        'ethers': 'ethers'
      },
      file: 'dist/es/index.js'
    },
    {
      format: 'umd',
      globals: {
        'ethers': 'ethers'
      },
      name: pkg.moduleName,
      file: 'dist/umd/index.js'
    },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    sucrase({
      exclude: ['node_modules/**'],
      transforms: ['typescript', 'jsx']
    }),
    resolve({
      extensions: ['.js', '.ts', '.jsx']
    }),
    nodeResolve(),
    commonjs({
      include: 'node_modules/**'
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'production' ),
      preventAssignment: true
    })
  ]
}
