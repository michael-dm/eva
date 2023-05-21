import { initTRPC } from '@trpc/server'

// You can use any variable name you like.
// We use t to keep things simple.
const t = initTRPC.create()
const { router, middleware, procedure } = t

export { router, middleware, procedure }
