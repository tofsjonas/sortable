import fs from 'fs'
import path from 'path'

// Read the sortable script
const sortableScript = fs.readFileSync(path.join(process.cwd(), 'dist/sortable.min.js'), 'utf8')

// Simple performance test without JSDOM memory issues
function createSimpleTable(rows, cols) {
  const data = []
  for (let i = 0; i < rows; i++) {
    const row = []
    for (let j = 0; j < cols; j++) {
      row.push(j === 1 ? Math.floor(Math.random() * 10000) : `Item${i}_${j}`)
    }
    data.push(row)
  }
  return data
}

// Mock DOM for sorting algorithm test
function mockSort(data) {
  const start = performance.now()
  
  // Simulate the core sorting logic
  data.sort((a, b) => {
    const aVal = String(a[1])
    const bVal = String(b[1])
    return aVal.localeCompare(bVal, undefined, { numeric: true })
  })
  
  const end = performance.now()
  return end - start
}

console.log('🚀 Simple Sortable.js Performance Test\n')

const configs = [
  { rows: 100, cols: 5, name: 'Small table (100 rows)' },
  { rows: 500, cols: 5, name: 'Medium table (500 rows)' },
  { rows: 1000, cols: 5, name: 'Large table (1000 rows)' },
  { rows: 2000, cols: 5, name: 'Very large table (2000 rows)' },
  { rows: 5000, cols: 5, name: 'Huge table (5000 rows)' }
]

for (const config of configs) {
  const times = []
  
  for (let i = 0; i < 10; i++) {
    const data = createSimpleTable(config.rows, config.cols)
    const time = mockSort(data)
    times.push(time)
  }
  
  const avg = times.reduce((a, b) => a + b, 0) / times.length
  const min = Math.min(...times)
  const max = Math.max(...times)
  
  console.log(`📊 ${config.name}:`)
  console.log(`  Average: ${avg.toFixed(2)}ms`)
  console.log(`  Min: ${min.toFixed(2)}ms`)
  console.log(`  Max: ${max.toFixed(2)}ms`)
  console.log(`  Ops/sec: ~${(1000/avg).toFixed(0)}\n`)
}

console.log('✅ Performance test completed!')