// vite.config.js
import { defineConfig } from 'vite'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import { resolve, basename } from 'path'

const createBuildConfig = (entry, outputDir, standalone = false, minify = false) => ({
  emptyOutDir: false,
  lib: {
    entry,
    formats: ['es'],
  },
  rollupOptions: {
    output: {
      entryFileNames: `${outputDir}/[name].js`,
      inlineDynamicImports: standalone,
    },
    plugins: [typescript()],
  },
  minify,
})

const createPlugins = (minify = false) => [
  typescript(),
  ...(minify
    ? [
        terser({
          format: {
            comments: 'all',
          },
          compress: {
            toplevel: true,
            passes: 2,
          },
          mangle: false,
        }),
      ]
    : []),
]

export default defineConfig(({ command, mode }) => {
  const modularConfig = {
    build: {
      ...createBuildConfig(
        {
          'sortable.a11y': resolve(__dirname, 'src/sortable.a11y.ts'),
          sortSortable: resolve(__dirname, 'src/sortSortable.ts'),
          sortableEventListener: resolve(__dirname, 'src/sortableEventListener.ts'),
          sortable: resolve(__dirname, 'src/sortable.ts'),
          enhanceSortableAccessibility: resolve(__dirname, 'src/enhanceSortableAccessibility.ts'),
        },
        'esm',
      ),
      // Add declaration file generation
      rollupOptions: {
        output: {
          dir: 'dist/esm',
        },
      },
    },
    plugins: [
      typescript({
        declaration: true,
        declarationDir: 'dist/esm',
        rootDir: 'src',
      }),
      ...createPlugins(),
    ],
  }
  const inlineConfigA11y = {
    build: createBuildConfig(
      {
        'sortable.a11y': resolve(__dirname, 'src/sortable.a11y.ts'),
      },
      'standalone',
      true,
    ),
    plugins: createPlugins(),
  }

  const inlineConfig = {
    build: createBuildConfig(
      {
        sortable: resolve(__dirname, 'src/sortable.ts'),
      },
      'standalone',
      true,
    ),
    plugins: createPlugins(),
  }

  const bundledConfig = {
    build: {
      ...createBuildConfig(resolve(__dirname, 'src/sortable.ts'), '', false, true),
      rollupOptions: {
        output: {
          format: 'es',
          compact: true,
          preserveModules: false,
          entryFileNames: `[name].js`,
        },
      },
    },
    plugins: createPlugins(true),
    esbuild: {
      minifyIdentifiers: false,
      minify: false,
    },
  }

  const bundledA11yConfig = {
    ...inlineConfigA11y,
    build: {
      ...inlineConfigA11y.build,
      rollupOptions: {
        ...inlineConfigA11y.build.rollupOptions,
        output: {
          ...inlineConfigA11y.build.rollupOptions.output,
          entryFileNames: '[name].js',
        },
      },
    },
  }

  switch (mode) {
    case 'bundle':
      return bundledConfig
    case 'bundle-a11y':
      return bundledA11yConfig
    case 'standalone':
      return inlineConfig
    case 'standalone-a11y':
      return inlineConfigA11y
    case 'module':
      return modularConfig
    default:
      return bundledConfig
  }
})
