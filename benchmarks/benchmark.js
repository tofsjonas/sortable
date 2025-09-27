import Benchmark from 'benchmark'
import { JSDOM } from 'jsdom'
import fs from 'fs'
import path from 'path'

// Read the sortable script
const sortableScript = fs.readFileSync(path.join(process.cwd(), 'dist/sortable.min.js'), 'utf8')

// Create test data generators
function generateTableData(rows, cols) {
  const data = []
  for (let i = 0; i < rows; i++) {
    const row = []
    for (let j = 0; j < cols; j++) {
      if (j === 0) {
        row.push(`Item ${Math.floor(Math.random() * 1000)}`)
      } else if (j === 1) {
        row.push(Math.floor(Math.random() * 10000))
      } else {
        row.push(`Col${j}_${Math.random().toString(36).substr(2, 5)}`)
      }
    }
    data.push(row)
  }
  return data
}

function createTableHTML(data, tableClass = 'sortable') {
  const headers = data[0].map((_, i) => `<th>Column ${i + 1}</th>`).join('')
  const rows = data.map(row => 
    `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
  ).join('')
  
  return `
    <table class="${tableClass}">
      <thead><tr>${headers}</tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `
}

// Benchmark configurations
const configs = [
  { rows: 100, cols: 5, name: 'Small table (100 rows, 5 cols)' },
  { rows: 500, cols: 5, name: 'Medium table (500 rows, 5 cols)' },
  { rows: 1000, cols: 5, name: 'Large table (1000 rows, 5 cols)' },
  { rows: 100, cols: 10, name: 'Wide table (100 rows, 10 cols)' }
]

console.log('🚀 Starting Sortable.js Benchmarks\n')

// Run benchmarks for each configuration
for (const config of configs) {
  console.log(`📊 Testing: ${config.name}`)
  
  const suite = new Benchmark.Suite()
  const testData = generateTableData(config.rows, config.cols)
  
  // Pre-create DOM to avoid memory issues
  const dom = new JSDOM(`
    <!DOCTYPE html>
    <html>
      <head><title>Benchmark</title></head>
      <body>
        ${createTableHTML(testData)}
        <script>${sortableScript}</script>
      </body>
    </html>
  `, { runScripts: 'dangerously' })
  
  const { window } = dom
  const table = window.document.querySelector('table.sortable')
  const firstHeader = table.querySelector('th')
  
  suite
    .add(`Sort ${config.name}`, function() {
      // Simulate click event
      const event = new window.MouseEvent('click', { bubbles: true })
      firstHeader.dispatchEvent(event)
    })
    .on('cycle', function(event) {
      console.log(`  ${String(event.target)}`)
    })
    .on('complete', function() {
      console.log(`  Fastest: ${this.filter('fastest').map('name')}\n`)
      dom.window.close()
      if (global.gc) global.gc()
    })
    .run({ async: false })
}

console.log('✅ Benchmarks completed!')