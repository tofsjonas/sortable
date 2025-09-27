# Sortable.js Benchmarks

This directory contains performance benchmarks for the sortable table library.

## Running Benchmarks

### Benchmark.js (Node.js)

```bash
npm run build
npm run compile
npm run benchmark
```

### Playwright Performance Tests

```bash
npm run test:benchmark
```

## Benchmark Types

### 1. Benchmark.js Tests (`benchmark.js`)

- Uses JSDOM for server-side testing
- Tests various table sizes (100-2000 rows)
- Measures operations per second
- Good for comparing relative performance

### 2. Playwright Tests (`tests/benchmark.spec.ts`)

- Uses real browser environment
- Measures actual millisecond timing
- Tests performance thresholds
- Includes memory stability tests

## Performance Expectations

| Table Size | Expected Sort Time |
| ---------- | ------------------ |
| 100 rows   | < 50ms             |
| 500 rows   | < 200ms            |
| 1000 rows  | < 500ms            |
| 2000 rows  | < 1000ms           |

## Adding New Benchmarks

To add new performance tests:

1. **Benchmark.js**: Add new configurations to the `configs` array
2. **Playwright**: Add new test cases with appropriate performance thresholds
