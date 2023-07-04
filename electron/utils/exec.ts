import { spawn } from 'node:child_process'
import { Buffer } from 'node:buffer'

export function execAsync(command: string, stdin: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, { shell: true, stdio: ['pipe', 'pipe', 'inherit'] })
    child.stdin.write(stdin)
    child.stdin.end()
    child.stdin.on('error', err => reject(err))

    const chunks: Buffer[] = []

    child.stdout.on('error', err => reject(err))
    child.stdout.on('data', (chunk: Buffer) => chunks.push(chunk))
    child.stdout.on('end', () => resolve(Buffer.concat(chunks).toString()))
    child.on('error', err => reject(err))
    child.on('exit', (code: number) => {
      if (code !== 0)
        reject(new Error(`"${command}" process exited with code ${code}`))
    })
  })
}