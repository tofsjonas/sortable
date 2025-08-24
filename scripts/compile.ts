// scripts/compile.ts
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { fileURLToPath } from 'url'

// Get the current directory name
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function processDirectory(directory: string) {
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err)
      return
    }

    files.forEach((file) => {
      const filePath = path.join(directory, file)
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('Error getting file stats:', err)
          return
        }

        if (stats.isFile() && file.endsWith('.js') && !file.endsWith('.min.js')) {
          const outputFilePath = path.join(directory, file.replace('.js', '.min.js'))

          const command = `google-closure-compiler --js=${filePath} --js_output_file=${outputFilePath}`
          exec(command, (err, stdout, stderr) => {
            if (err) {
              console.error(`Error compiling ${file}:`, err)
              return
            }
            if (stderr) {
              console.error(`Compiler stderr for ${file}:`, stderr)
            }
            console.log(`Compiled ${file} to ${outputFilePath}`)
          })
        }
      })
    })
  })
}

// Get directories from command-line arguments
const directories = process.argv.slice(2)

if (directories.length === 0) {
  console.error('Please provide at least one directory as an argument.')
  process.exit(1)
}

directories.forEach((directory) => {
  const fullPath = path.isAbsolute(directory) ? directory : path.join(__dirname, '..', directory)
  processDirectory(fullPath)
})
