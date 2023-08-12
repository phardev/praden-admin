// https://v3.nuxtjs.org/api/configuration/nuxt.config
import { fileURLToPath } from 'url'

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      PREPARATION_STARTED_TEMPLATE_ID:
        process.env.PREPARATION_STARTED_TEMPLATE_ID,
      SEND_EMAIL_URL: process.env.SEND_EMAIL_URL,
      BACKEND_URL: process.env.BACKEND_URL
    }
  },
  alias: {
    '@adapters': fileURLToPath(new URL('./src/adapters/', import.meta.url)),
    '@core': fileURLToPath(new URL('./src/core/', import.meta.url)),
    '@store/': fileURLToPath(new URL('./src/store/', import.meta.url)),
    '@utils/': fileURLToPath(new URL('./src/utils/', import.meta.url))
  },
  app: {
    head: {
      title: 'Praden Admin'
    }
  },
  build: {
    transpile: [
      'vue-qr',
      '@diadal/vue3-qr-code-styling',
      '@vuepic/vue-datepicker'
    ]
  },
  components: {
    dirs: [
      {
        path: '~/src/adapters/primary/nuxt/components/',
        global: true
      },
      '~/components'
    ]
  },
  typescript: {
    strict: true
  },
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', 'nuxt-icon', '@vueuse/nuxt'],
  dir: {
    // assets: 'custom-assets',
    layouts: './src/adapters/primary/nuxt/layouts',
    // middleware: 'custom-middleware',
    pages: './src/adapters/primary/nuxt/pages/'
    // static: 'custom-static',
    // store: 'custom-store'
  },
  css: ['~/assets/css/tailwind.css'],
  ssr: true
})
