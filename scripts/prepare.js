const child_process = require('child_process')

// so we don't install husky in CI
if (!process.env.CI) {
  const log = child_process.execSync('npx husky install', { encoding: 'utf8', stdio: 'pipe' }).trim()
  console.log(log)
}
