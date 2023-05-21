import vuetify from 'vite-plugin-vuetify'
import type { ElectronOptions } from 'nuxt-electron'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  router: {
    options: {
      hashMode: true,
    },
  },
  vite: {
    server: {
      middlewareMode: false,
    },
  },
  app: {
    baseURL: './',
  },
  modules: [
    async (options, nuxt) => {
      // @ts-expect-error: remove ts error
      nuxt.hooks.hook('vite:extendConfig', config => config.plugins.push(
        vuetify(),
      ))
    },
    ['nuxt-electron', <ElectronOptions>{
      include: ['electron', 'server'],
    }],
  ],
  hooks: {
    // Remove aliases to only have one
    // https://github.com/nuxt/framework/issues/7277
    'prepare:types': function ({ tsConfig }) {
      const aliasesToRemoveFromAutocomplete = ['~~', '~~/*', '@', '@/*', '@@', '@@/*']
      for (const alias of aliasesToRemoveFromAutocomplete) {
        if (tsConfig.compilerOptions!.paths[alias])
          delete tsConfig.compilerOptions!.paths[alias]
      }
    },
  },
})

