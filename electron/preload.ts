import { exposeElectronTRPC } from 'electron-trpc/main'

console.log('--- preload.ts ---')

process.once('loaded', async () => {
  exposeElectronTRPC()
})
