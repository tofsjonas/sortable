import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import scss from 'rollup-plugin-scss'
// const terser_config = {
//   ecma: 5,
//   mangle: { toplevel: true },
//   compress: {
//     module: true,
//     toplevel: true,
//     unsafe_arrows: true,
//     drop_console: false,
//     drop_debugger: true,
//   },
//   output: {
//     beautify: false,
//     quote_style: 1,
//     comments: false,
//   },
// }

const terser_config = {
  ecma: 5,
  // mangle: false,
  mangle: true,

  compress: true,
  output: {
    beautify: false,
    preserve_annotations: true,
    quote_style: 1,
    comments: true,
    ecma: 2020,
  },
}

export default [
  ...['example', 'sortable', 'sortable-base']
    .map((s) => {
      return [
        {
          input: `src/scss/${s}.scss`,
          output: {
            file: `dist/${s}.css`,
          },
          plugins: [
            scss({
              fileName: `${s}.css`,
              outputStyle: 'expanded',
              failOnError: true,
            }),
          ],
        },
        {
          input: `src/scss/${s}.scss`,
          output: {
            file: `dist/${s}.min.css`,
          },
          plugins: [
            scss({
              fileName: `${s}.min.css`,
              outputStyle: 'compressed',
              failOnError: true,
            }),
          ],
        },
      ]
    })
    .flat(),
  ...['sortable', 'sortable.a11y', 'sortSortable', 'sortableEventListener', 'enhanceSortableAccessibility'].map((s) => {
    return {
      input: `dist/esm/${s}.js`,
      output: {
        file: `dist/esm/${s}.min.js`,
        format: 'es',
      },
      plugins: [terser(terser_config)],
    }
  }),
]
