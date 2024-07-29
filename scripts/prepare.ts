// so we don't install husky in CI
if (!process.env.CI) {
  const log = require('child_process').execSync('npx husky install', { encoding: 'utf8', stdio: 'pipe' }).trim()
  console.log(log)
}
