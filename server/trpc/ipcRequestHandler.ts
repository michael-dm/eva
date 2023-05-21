import type { AnyRouter, inferRouterContext } from '@trpc/server'
import type { HTTPRequest } from '@trpc/server/dist/http/internals/types'
import { resolveHTTPResponse } from '@trpc/server/http'
import type { IpcRequest, IpcResponse } from '~~/types/Ipc'

export default async function ipcRequestHandler<TRouter extends AnyRouter>(
  opts: {
    req: IpcRequest
    router: TRouter
    batching?: { enabled: boolean }
    onError?: (o: { error: Error; req: IpcRequest }) => void
    endpoint: string
    createContext?: (params: { req: IpcRequest }) => Promise<inferRouterContext<TRouter>>
  },
): Promise<IpcResponse> {
  const createContext = async () => {
    return opts.createContext?.({ req: opts.req })
  }

  // adding a fake "https://electron" to the URL so it can be parsed
  const url = new URL(`https://electron${opts.req.url}`)
  const path = url.pathname.slice(opts.endpoint.length + 1)
  const req: HTTPRequest = {
    query: url.searchParams,
    method: opts.req.method,
    headers: opts.req.headers,
    body: opts.req.body,
  }

  const result = await resolveHTTPResponse({
    req,
    createContext,
    path,
    router: opts.router,
    batching: opts.batching,
    onError(o) {
      opts?.onError?.({ ...o, req: opts.req })
    },
  })

  return {
    body: result.body,
    headers: result.headers,
    status: result.status,
  }
}
