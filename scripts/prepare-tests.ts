import fs from 'fs'
import path from 'path'

const DIST_TYPES = ['bundled', 'standalone', 'esm'] as const

function createHTML(type: (typeof DIST_TYPES)[number], minified: boolean = false) {
  let template = fs.readFileSync('index.html', 'utf8')

  // Remove the existing script tags
  template = template
    .replace('<link rel="stylesheet" type="text/css" href="src/scss/example.scss" />', '')
    .replace('<script type="module" src="/src/sortable.ts"></script>', '')
    .replace('<script type="module" src="/src/sortable.a11y.ts"></script>', '')

  // Add CSS
  const cssFiles = minified ? ['sortable.min.css', 'example.min.css'] : ['sortable.css', 'example.css']

  const cssLinks = cssFiles.map((file) => `<link rel="stylesheet" href="/${file}">`).join('\n')

  template = template.replace('</head>', `${cssLinks}\n</head>`)

  // Generate script tags based on format and minified state
  let scripts = ''
  const jsExt = minified ? '.min.js' : '.js'

  switch (type) {
    case 'bundled':
      scripts = `
        <script src="/sortable${jsExt}"></script>
        <script src="/sortable.a11y${jsExt}"></script>`
      break
    case 'standalone':
      scripts = `
        <script src="/${type}/sortable${jsExt}"></script>
        <script src="/${type}/sortable.a11y${jsExt}"></script>`
      break
    case 'esm':
      scripts = `
        <script type="module">
          import './esm/sortable${jsExt}';
          import './esm/sortable.a11y${jsExt}';
        </script>`
      break
  }

  template = template.replace('</body>', `${scripts}\n</body>`)

  // Save the file
  const outputPath = `dist/${type}${minified ? '.min' : ''}.html`
  fs.writeFileSync(outputPath, template)
  console.log(`Created ${outputPath}`)
}

function cleanup() {
  DIST_TYPES.forEach((type) => {
    ;['', '.min'].forEach((suffix) => {
      const filePath = `dist/${type}${suffix}.html`
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
        console.log(`Cleaned up ${filePath}`)
      }
    })
  })
}

if (process.argv.includes('cleanup')) {
  cleanup()
} else {
  DIST_TYPES.forEach((type) => {
    createHTML(type, false) // Unminified version
    createHTML(type, true) // Minified version
  })
}
