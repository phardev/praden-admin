module.exports = {
  darkMode: 'class',
  content: [
    './assets/**/*.{vue,js,css}',
    './src/adapters/primary/nuxt/components/**/*.{vue,js}',
    './src/adapters/primary/nuxt/layouts/**/*.vue',
    './src/adapters/primary/nuxt/pages/**/*.vue',
    './src/adapters/primary/nuxt/plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}'
  ],
  plugins: [
    // ...
    require('@tailwindcss/forms')
  ],
  variants: {
    extend: {}
  },
  theme: {
    extend: {
      colors: {
        primary1: '#fffcfe',
        primary2: '#fff7fc',
        primary3: '#feeef8',
        primary4: '#fce5f3',
        primary5: '#f9d8ec',
        primary6: '#f3c6e2',
        primary7: '#ecadd4',
        primary8: '#e38ec3',
        primary9: '#d6409f',
        primary10: '#d23197',
        primary11: '#cd1d8d',
        primary12: '#3b0a2a',

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
        grass12: '#1b311e'
      }
    }
  }
}
