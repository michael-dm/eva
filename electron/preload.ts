import { contextBridge, ipcRenderer } from 'electron'
import type { IpcRequest } from '~/types/Ipc'

contextBridge.exposeInMainWorld('api', {
  trpc: (req: IpcRequest) => ipcRenderer.invoke('trpc', req),
})
