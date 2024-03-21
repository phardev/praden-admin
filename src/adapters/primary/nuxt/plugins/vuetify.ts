import { createVuetify } from 'vuetify'
import '~/assets/vuetify/variables.scss'
import { MAIN_THEME, mainTheme } from '@utils/vuetify/vuetify-themes'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: false,
    theme: {
      defaultTheme: MAIN_THEME,
      themes: {
        mainTheme
      }
    }
  })
  nuxtApp.vueApp.use(vuetify)
})
