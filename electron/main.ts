import { release } from 'os'
import path from 'path'
import fs from 'fs'
import { BrowserWindow, app, ipcMain, shell } from 'electron'
// Use relative path to avoid issues
import ipcRequestHandler from '../server/trpc/ipcRequestHandler'
import { appRouter } from '../server/trpc/routers'
import type { IpcRequest } from '~/types/Ipc'

// Remove electron security warnings only in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/securit
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1'))
  app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32')
  app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null

const preload = path.join(__dirname, 'preload.js')
const distPath = path.join(__dirname, '../../.output/public')

async function createWindow() {
  win = new BrowserWindow({
    webPreferences: {
      preload,
      // Warning: Enabling nodeIntegration and disabling contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  if (app.isPackaged) {
    win.loadFile(path.join(distPath, 'index.html'))
  }
  else {
    win.loadURL(process.env.VITE_DEV_SERVER_URL!)
    win.webContents.openDevTools()
  }

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:'))
      shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin')
    app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized())
      win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length)
    allWindows[0].focus()

  else
    createWindow()
})

app.whenReady().then(() => {
  ipcMain.handle('trpc', (event, req: IpcRequest) => {
    return ipcRequestHandler({
      endpoint: '/trpc',
      req,
      router: appRouter,
    })
  })

  if (app.isPackaged) {
    const hasDb = fs.existsSync(`${path.join(app.getPath('userData'), 'app.db')}`)
    // TODO: Run new migrations at startup
    if (!hasDb)
      fs.copyFileSync(path.join(process.resourcesPath, 'server/prisma/app.db'), path.join(app.getPath('userData'), 'app.db'))
  }

  createWindow()
})
