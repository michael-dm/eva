import { z } from 'zod'
import { procedure, router } from '../trpc'
import { prisma } from '../prisma'

export default router({
  getAll: procedure.query(() => {
    return prisma.post.findMany()
  }),
  create: procedure
    .input(z.object({
      title: z.string().max(32),
      description: z.string().max(64),
    }))
    .mutation(({ input }) => {
      return prisma.post.create({ data: input })
    }),
  delete: procedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(({ input }) => {
      return prisma.post.delete({ where: { id: input.id } })
    }),
})
