import { Stream } from "node:stream";

declare module 'elevenlabs-node' {
    type VoiceSettings = {
        stability: number,
        similarityBoost: number
    }

    type VoiceResponse = {
        // Add the fields in the voice response object here
    }

    type OperationStatus = {
        status: string
    }

    function textToSpeech(
        apiKey: string,
        voiceID: string,
        fileName: string,
        textInput: string,
        stability?: number,
        similarityBoost?: number,
        modelId?: string
    ): Promise<OperationStatus>;

    function textToSpeechStream(
        apiKey: string,
        voiceID: string,
        textInput: string,
        stability?: number,
        similarityBoost?: number,
        modelId?: string
    ): Promise<Stream>;

    function getVoices(
        apiKey: string
    ): Promise<VoiceResponse>;

    function getDefaultVoiceSettings(): Promise<VoiceSettings>;

    function getVoiceSettings(
        apiKey: string,
        voiceID: string
    ): Promise<VoiceSettings>;

    function getVoice(
        apiKey: string,
        voiceID: string
    ): Promise<VoiceResponse>;

    function deleteVoice(
        apiKey: string,
        voiceID: string
    ): Promise<OperationStatus>;

    function editVoiceSettings(
        apiKey: string,
        voiceID: string,
        stability: number,
        similarityBoost: number
    ): Promise<OperationStatus>;

    export {
        textToSpeech,
        textToSpeechStream,
        getVoices,
        getDefaultVoiceSettings,
        getVoiceSettings,
        getVoice,
        deleteVoice,
        editVoiceSettings
    }
}

declare module 'speech-recorder' {
  export class SpeechRecorder {
    constructor(options: {
      consecutiveFramesForSilence: number
      sampleRate: number
      samplesPerFrame: number
      onChunkStart: (data: { audio: Int16Array[] }) => void
      onAudio: (data: {
        speaking: boolean,
        speech: boolean,
        probability: number,
        volume: number,
        consecutiveSilence: number,
        audio: Int16Array[]
      }) => void
      onChunkEnd: () => void
    })
    start(): void
    stop(): void
  }
}