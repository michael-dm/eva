import path from 'node:path'
import { execAsync } from '../utils/exec'
import { SpeechRecorder } from 'speech-recorder'
import { TypedEmitter } from 'tiny-typed-emitter'
import { WaveFile } from 'wavefile'

const binPath = path.join(__dirname, '../bin')
const soxPath = path.join(binPath, 'sox')
const whisperPath = path.join(binPath, 'whisper')
const smallModelPath = path.join(binPath, 'ggml-small.q8_0.bin')

const sampleRate = 16000
const samplesPerFrame = 480

interface SpeechEvent {
  'transcribed': (text: string) => void
  'will_transcribe': () => void
  'error': (error: Error) => void
}

export class Speech extends TypedEmitter<SpeechEvent> {
  private _recorder: SpeechRecorder

  constructor() {
    super()

    let buffer: any[] = []
    const speaking = false

    this._recorder = new SpeechRecorder({
      consecutiveFramesForSilence: 7,
      sampleRate,
      samplesPerFrame,
      onChunkStart: ({ audio }) => {
        this.emit('will_transcribe')
        buffer = []
        audio.forEach(sample => buffer.push(sample))
      },
      onAudio: ({ speaking, probability, speech, volume, audio, consecutiveSilence }) => {
        // console.log(Date.now(), speaking, speech, probability, volume, audio.length)
        if (speaking)
          audio.forEach(sample => buffer.push(sample))
      },
      onChunkEnd: async () => {
        if (buffer.length < samplesPerFrame * 20)
          return

        const time0 = Date.now()
        const wav = new WaveFile()
        wav.fromScratch(1, 16000, '16', buffer)
        const audio = wav.toBuffer()
        const time1 = Date.now()
        console.log(`Wav created in ${time1 - time0}ms`)

        execAsync(`${soxPath} -t wav - -t wav - tempo 0.8 | ${whisperPath} -m ${smallModelPath} - -l fr -nt -t 6`, audio)
          .then((transcript) => {
            const time2 = Date.now()
            console.log(`Transcript created in ${time2 - time1}ms : ${transcript}`)
            this.emit('transcribed', transcript)
          })
          .catch((error) => {
            this.emit('error', error)
          })
      },
    })

    console.log('Recording...')
    this._recorder.start()
  }

  stop() {
    console.log('Stopping...')
    this._recorder.stop()
  }
}
