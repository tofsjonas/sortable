// vite.config.js
import { defineConfig } from 'vite'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import { resolve } from 'path'

const esbuild = {
  minifyIdentifiers: false,
  minify: false,
  // keepNames: true,
  target: 'es2020',
  charset: 'utf8',
  legalComments: 'inline',
  drop: ['debugger'],
  define: { global: 'window' },
}

const modularConfig = defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: {
        'sortable.a11y': resolve(__dirname, 'src/sortable.a11y.ts'),
        'sortable.auto': resolve(__dirname, 'src/sortable.auto.ts'),
        sortSortable: resolve(__dirname, 'src/sortSortable.ts'),
        sortableEventListener: resolve(__dirname, 'src/sortableEventListener.ts'),
        sortable: resolve(__dirname, 'src/sortable.ts'),
        observeSortable: resolve(__dirname, 'src/observeSortable.ts'),
        enhanceSortableAccessibility: resolve(__dirname, 'src/a11y/enhanceSortableAccessibility.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: { output: { dir: 'dist/esm', entryFileNames: '[name].js', inlineDynamicImports: false } },
  },
  plugins: [typescript({ declaration: true, declarationDir: 'dist/esm', rootDir: 'src' })],
  esbuild,
})

const inlineConfigA11y = defineConfig({
  build: {
    emptyOutDir: false,
    lib: { entry: { 'sortable.a11y': resolve(__dirname, 'src/sortable.a11y.ts') }, formats: ['es'] },
    rollupOptions: { output: { entryFileNames: 'standalone/[name].js', inlineDynamicImports: true } },
  },
  plugins: [typescript()],
  esbuild,
})

const inlineConfigAuto = defineConfig({
  build: {
    emptyOutDir: false,
    lib: { entry: { 'sortable.auto': resolve(__dirname, 'src/sortable.auto.ts') }, formats: ['es'] },
    rollupOptions: { output: { entryFileNames: 'standalone/[name].js', inlineDynamicImports: true } },
  },
  plugins: [typescript()],
  esbuild,
})

const inlineConfig = defineConfig({
  build: {
    emptyOutDir: false,
    lib: { entry: { sortable: resolve(__dirname, 'src/sortable.ts') }, formats: ['es'] },
    rollupOptions: { output: { entryFileNames: 'standalone/[name].js', inlineDynamicImports: true } },
  },
  plugins: [typescript()],
  esbuild,
})

const bundledConfig = defineConfig({
  build: {
    emptyOutDir: false,
    lib: { entry: resolve(__dirname, 'src/sortable.ts'), formats: ['es'] },
    rollupOptions: { output: { format: 'es', compact: true, preserveModules: false, entryFileNames: '[name].js' } },
    minify: true,
  },
  plugins: [
    typescript(),
    terser({ format: { comments: 'all' }, compress: { toplevel: true, passes: 2 }, mangle: false }),
  ],
  esbuild,
})

const bundledA11yConfig = defineConfig({
  build: {
    emptyOutDir: false,
    lib: { entry: { 'sortable.a11y': resolve(__dirname, 'src/sortable.a11y.ts') }, formats: ['es'] },
    rollupOptions: { output: { entryFileNames: '[name].js', inlineDynamicImports: true } },
  },
  plugins: [typescript()],
  esbuild,
})

const bundledAutoConfig = defineConfig({
  build: {
    emptyOutDir: false,
    lib: { name: 'SL', entry: { 'sortable.auto': resolve(__dirname, 'src/sortable.auto.ts') }, formats: ['iife'] },
    rollupOptions: { output: { dir: 'dist', entryFileNames: '[name].js', inlineDynamicImports: true } },
  },
  plugins: [typescript()],
  esbuild,
})

export default defineConfig(({ mode }) => {
  switch (mode) {
    case 'bundle':
      return bundledConfig
    case 'bundle-a11y':
      return bundledA11yConfig
    case 'bundle-auto':
      return bundledAutoConfig
    case 'standalone':
      return inlineConfig
    case 'standalone-a11y':
      return inlineConfigA11y
    case 'standalone-auto':
      return inlineConfigAuto
    case 'module':
      return modularConfig
    default:
      return bundledConfig
  }
})
