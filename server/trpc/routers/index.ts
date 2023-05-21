import { z } from 'zod'
import { procedure, router } from '../trpc'
import post from './post'

export const appRouter = router({
  post,
  greeting: procedure
    .input(z.object({ name: z.string() }).nullish())
    .query(({ input }) => {
      return `hello ${input?.name ?? 'world'}!`
    }),
})

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter
