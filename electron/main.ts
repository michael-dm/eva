import { release } from 'node:os'
import path from 'node:path'
import fs from 'node:fs'
import { BrowserWindow, app, screen, shell } from 'electron'
import { createIPCHandler } from 'electron-trpc/main'
import { appRouter } from './trpc/routers'

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

const winWidth = 440
const winHeight = 400
async function createWindow() {
  win = new BrowserWindow({
    // alwaysOnTop: true,
    frame: false,
    titleBarStyle: 'hidden',
    resizable: false,
    vibrancy: 'light',
    width: winWidth,
    height: winHeight,
    webPreferences: {
      preload,
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  })
  
  win.setWindowButtonVisibility(false)
  //win.webContents.openDevTools({ mode: 'detach' })

  const display = screen.getPrimaryDisplay()
  const { x, y, width } = display.bounds
  win.setPosition(x + width - winWidth - 10, y + 46)

  if (app.isPackaged)
    win.loadFile(path.join(distPath, 'index.html'))
  else
    win.loadURL(process.env.VITE_DEV_SERVER_URL!)

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:'))
      shell.openExternal(url)
    return { action: 'deny' }
  })

  createIPCHandler({ router: appRouter, windows: [win] })
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
  if (app.isPackaged) {
    const hasDb = fs.existsSync(`${path.join(app.getPath('userData'), 'app.db')}`)
    // TODO: Run new migrations at startup
    if (!hasDb)
      fs.copyFileSync(path.join(process.resourcesPath, 'electron/prisma/app.db'), path.join(app.getPath('userData'), 'app.db'))
  }

  createWindow()
})
