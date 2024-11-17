import fs from 'fs'
import path from 'path'

const DIST_TYPES = ['bundled', 'standalone', 'esm', 'demo'] as const

function createHTML(type: (typeof DIST_TYPES)[number], minified: boolean = false) {
  if (type === 'demo' && minified) return
  let template = fs.readFileSync('index.html', 'utf8')

  // Remove the existing script tags
  template = template
    .replace('<link rel="stylesheet" type="text/css" href="src/scss/example.scss" />', '')
    .replace('<script type="module" src="/src/sortable.ts"></script>', '')
    .replace('<script type="module" src="/src/sortable.a11y.ts"></script>', '')

  const css_file_name = `example${minified ? '.min' : ''}.css`

  const css_url = type !== 'demo' ? `/${css_file_name}` : `../dist/${css_file_name}`

  const css_link = `<link rel="stylesheet" href="${css_url}">`

  template = template.replace('</head>', `${css_link}\n</head>`)

  // Generate script tags based on format and minified state
  let scripts = ''
  const jsExt = minified ? '.min.js' : '.js'

  switch (type) {
    case 'bundled':
      scripts = `
    <script src="/sortable${jsExt}"></script>
    <script src="/sortable.a11y${jsExt}"></script>`
      break
    case 'demo':
      scripts = `
    <script src="../dist/sortable.js"></script>
    <script src="../dist/sortable.a11y.js"></script>`
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
  const outputPath = type === 'demo' ? 'demo/index.html' : `dist/${type}${minified ? '.min' : ''}.html`

  // if no such directory, create it
  if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  }

  fs.writeFileSync(outputPath, template)
  console.log(`Created ${outputPath}`)
}

function cleanup() {
  DIST_TYPES.forEach((type) => {
    if (type === 'demo') return
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
