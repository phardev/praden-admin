// https://v3.nuxtjs.org/api/configuration/nuxt.config
import { fileURLToPath } from 'url'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      PREPARATION_STARTED_TEMPLATE_ID:
        process.env.PREPARATION_STARTED_TEMPLATE_ID,
      SEND_EMAIL_URL: process.env.SEND_EMAIL_URL,
      BACKEND_URL: process.env.BACKEND_URL,
      KEYCLOAK_URL: process.env.KEYCLOAK_URL,
      KEYCLOAK_REALM: process.env.KEYCLOAK_REALM,
      KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID
    }
  },
  alias: {
    '@adapters/': fileURLToPath(new URL('./src/adapters/', import.meta.url)),
    '@core/': fileURLToPath(new URL('./src/core/', import.meta.url)),
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
      '@vuepic/vue-datepicker',
      'vuetify'
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
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    'nuxt-icon',
    '@vueuse/nuxt',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        config.plugins.push(
          vuetify({
            autoImport: true,
            styles: { configFile: 'assets/vuetify/variables.scss' }
          })
        )
      })
    }
  ],
  dir: {
    // assets: 'custom-assets',
    layouts: './src/adapters/primary/nuxt/layouts',
    // middleware: 'custom-middleware',
    pages: './src/adapters/primary/nuxt/pages/',
    plugins: './src/adapters/primary/nuxt/plugins/'
    // static: 'custom-static',
    // store: 'custom-store'
  },
  css: [
    '~/assets/css/tailwind.css',
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css',
    '~/assets/vuetify/variables.scss'
  ],
  ssr: false,
  vite: {
    define: {
      'process.env.DEBUG': false
    },
    vue: {
      template: {
        transformAssetUrls
      }
    },
    optimizeDeps: { exclude: ['fsevents'] }
  }
})
