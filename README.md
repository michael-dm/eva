# Electron Assistant

https://github.com/michael-dm/pascal/assets/26444186/8976ca25-6c14-40df-831d-403be91a4d0c

Boilerplate of whisper.cpp + chatGPT + Electron.
Goal is low latency.

Could be extended in many ways :
- add voice output with elevenlabs/Bark
- get text selection as input
- get file selection as input
- use OpenAI functions to execute "tools"
- save "memories" into Prisma db

e.g. : "convert this mov to wav please"

## Instructions

- Expose OPENAI_API_KEY env variable in your shell
- Add required binaries to `bin` folder
  - whisper -> main program from whisper.cpp
  - sox
  - at least one ggml whisper model (I use quantized french fine-tunes from [here](https://huggingface.co/bofenghuang/whisper-medium-cv11-french/tree/main))
- [Mac M1 binaries](https://www.dropbox.com/sh/ncxavljogsb6xch/AACzK0t2zWpZTT0EahDWDz-0a?dl=0) at your own risk
- Expect many bugs and hacks
