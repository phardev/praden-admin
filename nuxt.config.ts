// https://v3.nuxtjs.org/api/configuration/nuxt.config
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  experimental: {
    watcher: {
      ignored: [
        '**/.nuxt/types/**',
        '**/.output/**',
        '**/node_modules/**',
        '**/coverage/**'
      ]
    }
  },
  runtimeConfig: {
    public: {
      ENV: process.env.NUXT_PUBLIC_ENV,
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
      '@vuepic/vue-datepicker'
    ]
  },

  components: {
    dirs: [
      {
        path: '~/src/adapters/primary/nuxt/components/',
        global: true,
        pathPrefix: false
      },
      '~/components'
    ]
  },

  typescript: {
    strict: true
  },

  modules: [
    '@pinia/nuxt',
    'nuxt-icon',
    '@vueuse/nuxt',
    '@nuxt/ui',
    '@nuxtjs/i18n',
    'nuxt-tiptap-editor'
  ],

  tiptap: {
    prefix: 'Tiptap'
  },

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
    '@mdi/font/css/materialdesignicons.min.css'
  ],

  ssr: false,

  nitro: {
    preset: 'cloudflare-pages',
    cloudflare: {
      pages: {
        routes: {
          exclude: ['/api/*']
        }
      }
    },
    compatibilityFlags: ['nodejs_compat']
  },
  i18n: {
    bundle: {
      optimizeTranslationDirective: false
    },
    locales: [
      {
        code: 'fr',
        iso: 'fr-FR',
        file: 'fr.json',
        name: 'Français'
      }
    ],
    defaultLocale: 'fr',
    langDir: 'locales/'
  },

  vite: {
    define: {
      'process.env.DEBUG': false
    },
    optimizeDeps: { exclude: ['fsevents'] },
    server: {
      watch: {
        ignored: [
          path.resolve(__dirname, '.nuxt/types/**'),
          '**/types/**',
          '**/.output/**',
          '**/.nuxt/**',
          '**/node_modules/**',
          '**/coverage/**'
        ]
      }
    }
  },

  colorMode: {
    preference: 'light'
  },

  stylelint: {
    rules: {
      'at-rule-no-unknown': [
        true,
        {
          ignoreAtRules: [
            'tailwind',
            'apply',
            'variants',
            'responsive',
            'screen'
          ]
        }
      ],
      'no-descending-specificity': null
    },
    ignoreFiles: ['coverage/*']
  },
  compatibilityDate: '2024-10-17'
})
