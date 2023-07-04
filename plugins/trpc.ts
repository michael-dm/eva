import { createTRPCProxyClient } from '@trpc/client'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { ipcLink } from 'electron-trpc/renderer'
import type { AppRouter } from '~/electron/trpc/routers'

export type RouterInput = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>

export default defineNuxtPlugin(() => {
  const trpc = createTRPCProxyClient<AppRouter>({
    links: [ipcLink()],
  })

  return {
    provide: {
      trpc,
    },
  }
})
