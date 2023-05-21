import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((nuxtApp: any) => {
  const vuetify = createVuetify()
  nuxtApp.vueApp.use(vuetify)
})
