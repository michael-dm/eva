import { z } from 'zod'
import { observable } from '@trpc/server/observable'
import { procedure, router } from '../trpc'
import { Speech } from '../speech'
import { Chat } from '../chat'
import post from './post'
import { uuidV4 } from '../../utils/uuid'

export interface Message {
  type: 'user' | 'bot',
  text: string,
  messageId: string,
}

const speech = new Speech()
const chat = new Chat()

speech.on('transcribed', (transcript) => {
  chat.send(transcript)
})

export const appRouter = router({
  post,
  greeting: procedure
    .input(z.object({ name: z.string() }).nullish())
    .query(({ input }) => {
      return `hello ${input?.name ?? 'world'}!`
    }),
  message: procedure
    .subscription(() => {
      return observable<Message>((emit) => {
        speech.on('transcribed', (transcript) => {
          emit.next({
            type: 'user',
            text: transcript,
            messageId: uuidV4(),
          })
        })
        chat.on('message', (text, messageId) => {
          emit.next({
            type: 'bot',
            text,
            messageId,
          })
        })

        return () => { speech.stop() }
      })
    }),
  isLoading: procedure
    .subscription(() => {
      return observable((emit) => {
        speech.on('will_transcribe', () => {
          emit.next(true)
        })
      })
    }),
  error: procedure
    .subscription(() => {
      return observable<Error>((emit) => {
        speech.on('error', (error) => {
          console.log('error', error)
          emit.next(error)
        })
      })
    }),
})

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter
