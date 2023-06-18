import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

export default [
  {
    input: 'src/index.ts',
    output: {
      dir: 'build',
      format: 'cjs',
      strict: false,
      esModule: false,
    },
    plugins: [
      typescript({
        module: 'esnext',
      }),
    ],
  },
  {
    input: 'build/dts/index.d.ts',
    output: {
      file: 'build/index.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
];
