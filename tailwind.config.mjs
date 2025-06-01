import { join } from 'path'
import typography from '@tailwindcss/typography'

export default {
  darkMode: 'class',
  content: [
    join(__dirname, './assets/**/*.{vue,js,css}'),
    join(__dirname, './src/adapters/primary/nuxt/components/**/*.{vue,js}'),
    join(__dirname, './src/adapters/primary/nuxt/layouts/**/*.vue'),
    join(__dirname, './src/adapters/primary/nuxt/pages/**/*.vue'),
    join(__dirname, './src/adapters/primary/nuxt/plugins/**/*.{js,ts}'),
    join(__dirname, './nuxt.config.{js,ts}')
  ],
  plugins: [typography],
  corePlugins: {
    container: false
  },
  variants: {
    extend: {}
  },
  theme: {
    extend: {
      colors: {
        customPrimary: {
          50: '#fcf3fa',
          100: '#fbe8f7',
          200: '#f9d1f0',
          300: '#f5ace2',
          400: '#ee78cc',
          500: '#e450b5',
          600: '#d6409f',
          700: '#b6207a',
          800: '#971d65',
          900: '#7e1d56',
          950: '#4d0a32'
        },
        primary1: 'var(--color-primary1)',
        primary2: 'var(--color-primary2)',
        primary3: 'var(--color-primary3)',
        primary4: 'var(--color-primary4)',
        primary5: 'var(--color-primary5)',
        primary6: 'var(--color-primary6)',
        primary7: 'var(--color-primary7)',
        primary8: 'var(--color-primary8)',
        primary9: 'var(--color-primary9)',
        primary10: 'var(--color-primary10)',
        primary11: 'var(--color-primary11)',
        primary12: 'var(--color-primary12)',
        gray1: '#fbfdfc',
        gray2: '#f8faf9',
        gray3: '#f1f4f3',
        gray4: '#ecefed',
        gray5: '#e6e9e8',
        gray6: '#dfe4e2',
        gray7: '#d7dcda',
        gray8: '#c2c9c6',
        gray9: '#8a918e',
        gray10: '#808784',
        gray11: '#6a716e',
        gray12: '#111c18',
        tomato1: '#fffcfc',
        tomato2: '#fff8f7',
        tomato3: '#fff0ee',
        tomato4: '#ffe6e2',
        tomato5: '#fdd8d3',
        tomato6: '#fac7be',
        tomato7: '#f3b0a2',
        tomato8: '#ea9280',
        tomato9: '#e54d2e',
        tomato10: '#db4324',
        tomato11: '#ca3214',
        tomato12: '#341711',
        grass1: '#fbfefb',
        grass2: '#f3fcf3',
        grass3: '#ebf9eb',
        grass4: '#dff3df',
        grass5: '#ceebcf',
        grass6: '#b7dfba',
        grass7: '#97cf9c',
        grass8: '#65ba75',
        grass9: '#46a758',
        grass10: '#3d9a50',
        grass11: '#297c3b',
        grass12: '#1b311e',
        orange1: '#fefcfb',
        orange2: '#fef8f4',
        orange3: '#fff1e7',
        orange4: '#ffe8d7',
        orange5: '#ffdcc3',
        orange6: '#ffcca7',
        orange7: '#ffb381',
        orange8: '#fa934e',
        orange9: '#f76808',
        orange10: '#ed5f00',
        orange11: '#bd4b00',
        orange12: '#451e11'
      }
    }
  }
}
