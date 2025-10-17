import { execSync } from 'child_process'

const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim()

const protectedBranches = ['main', 'master']

if (protectedBranches.includes(currentBranch)) {
  console.error(`\n❌ Direct commits to '${currentBranch}' are not allowed!`)
  console.error('Please create a feature branch and make a pull request.\n')
  process.exit(1)
}
