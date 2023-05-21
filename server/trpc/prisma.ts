import path from 'path'
import { PrismaClient } from '@prisma/client'
import { app } from 'electron'

// Prevent multiple instances of Prisma Client in development
// https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#prevent-hot-reloading-from-creating-new-instances-of-prismaclient
// Add prisma to the global type
declare global {
  // Must use var, not let or const: https://stackoverflow.com/questions/35074713/extending-typescript-global-object-in-node-js/68328575#68328575
  // eslint-disable-next-line no-var, vars-on-top
  var prisma: PrismaClient
}

const isProduction = app.isPackaged
const dbPath
  = isProduction
    ? `file:${path.join(app.getPath('userData'), 'app.db')}`
    : process.env.DATABASE_URL

export const prisma = global.prisma ?? new PrismaClient({
  log: isProduction
    ? ['error']
    : ['query', 'info', 'error', 'warn'],
  datasources: {
    db: {
      url: dbPath,
    },
  },
})

if (!isProduction)
  global.prisma = prisma
