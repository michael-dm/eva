export interface IpcRequest {
  body: any
  headers: any
  method: string
  url: string
}

export interface IpcResponse {
  body: any
  headers: any
  status: number
}

