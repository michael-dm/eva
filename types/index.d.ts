export {}

declare global {
  // Import the types definitions
  interface Window {
    api: {
      trpc: (req: IpcRequest) => Promise<IpcResponse>
      serialport: {
        list: () => Promise<SerialPort.PortInfo[]>
      }
    }
  }
}
