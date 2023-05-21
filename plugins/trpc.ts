import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from '~~/server/trpc/routers'
import type { IpcRequest } from '~~/types/Ipc'

export type RouterInput = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>

export default defineNuxtPlugin(() => {
  const trpc = createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: '/trpc',
        // custom fetch implementation that sends the request over IPC to Main process
        fetch: async (input, init) => {
          const req: IpcRequest = {
            url: input instanceof URL ? input.toString() : typeof input === 'string' ? input : input.url,
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            method: input instanceof Request ? input.method : init?.method!,
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            headers: input instanceof Request ? input.headers : init?.headers!,
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            body: input instanceof Request ? input.body : init?.body!,
          }

          // console.log("Sending request to Main process", req)
          const resp = await window.api.trpc(req)
          // console.log("Got response from Main process", resp)

          return new Response(resp.body, {
            status: resp.status,
            headers: resp.headers,
          })
        },
      }),
    ],
  })

  return {
    provide: {
      trpc,
    },
  }
})
