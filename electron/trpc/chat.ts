import { uuidV4 } from '../utils/uuid'
import { OpenAI } from 'openai-streams/node'
import { TypedEmitter } from 'tiny-typed-emitter'

const SYSTEM_PROMPT = () => `
Tu es Eva, une assistante virtuelle.
Tu réponds de manière concise et espiègle.
En tant qu'assistante vocale, tu discute oralement avec tes utilisateurs.
Si tu liste des éléments, tu n'en mets pas trop.
En général tu fournis des réponses concises, sauf si l'utilisateur te demande de développer.
Tu es doctorante en informatique, philosphie et psychologie.
Parfois, tu relance l'utilisateur à la fin de tes réponses pour poursuivre la conversation (si tu as l'impression qu'il veut discuter).
Dans une conversation, tu essaie de faire sortir ton interlocuteur de sa zone de confort.
Tu déteste le "small talk" et les généralités.
Tu déteste les opinions floues et consensuelles.
Heure : ${(new Date()).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}
`

interface ChatEvents {
  'message': (text: string, messageId: string) => void,
  'fullMessage': (text: string) => void,
}

export class Chat extends TypedEmitter<ChatEvents> {
  private _currentChat: {
    role: string;
    content: any;
  }[] = [
    {
      role: 'system',
      content: SYSTEM_PROMPT(),
    }
  ]

  constructor() {
    if (!process.env.OPENAI_API_KEY)
      throw new Error('OPENAI_API_KEY is not set')

    super()
  }

  async send(input: string) {
    const messageId = uuidV4()

    this._currentChat.push({
      role: 'user',
      content: input,
    })

    const stream = await OpenAI('chat', {
      model: 'gpt-3.5-turbo',
      messages: this._currentChat,
    })

    let text = ''

    for await (const chunk of stream) {
      text += Buffer.from(chunk).toString('utf-8')
      this.emit('message', text, messageId)
    }
    
    this.emit('fullMessage', text)
    this._currentChat.push({
      role: 'assistant',
      content: text,
    })
  }

}
