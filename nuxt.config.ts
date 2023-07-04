// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    'nuxt-electron',
    '@vueuse/nuxt',
    '@unocss/nuxt',
  ],
  css: ['@unocss/reset/tailwind-compat.css'],
  electron: {
    build: [
      {
        entry: 'electron/main.ts',
        vite: {
          build: {
            rollupOptions: {
              external: ['speech-recorder', 'lfd-speaker', 'elevenlabs-node'],
            },
          },
        },
      },
      {
        entry: 'electron/preload.ts',
        onstart(options) {
          // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
          // instead of restarting the entire Electron App.
          options.reload()
        },
      },
    ],
    renderer: {},
  }
})
