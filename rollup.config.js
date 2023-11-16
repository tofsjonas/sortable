import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'

const terser_config = {
  ecma: 5,
  mangle: { toplevel: true },
  compress: {
    module: true,
    toplevel: true,
    unsafe_arrows: true,
    drop_console: false,
    drop_debugger: true,
  },
  output: {
    beautify: false,
    quote_style: 1,
    comments: false,
  },
}

export default [
  {
    input: './src/sortable.ts',
    output: {
      file: './sortable.js',
      indent: '  ',
    },
    plugins: [typescript()],
  },
  {
    input: './src/sortable.a11y.ts',
    output: {
      file: './sortable.a11y.js',
    },
    plugins: [typescript()],
  },
  // We will build these using closure compiler before pushing, but it's nice to have them
  {
    input: './src/sortable.a11y.ts',
    output: {
      file: './sortable.a11y.min.js',
    },
    plugins: [typescript(), terser(terser_config)],
  },
  {
    input: './src/sortable.ts',
    output: {
      file: './sortable.min.js',
    },
    plugins: [typescript(), terser(terser_config)],
  },
]
