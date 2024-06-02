import tsconfigPaths from 'vite-tsconfig-paths'
import * as path from 'path'

export default {
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      exclude: ['**/*.vue', '.nuxt', '*.config.*', '.eslintrc.js'],
      reporter: ['text', 'json', 'html']
    }
  },
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, '.')
    }
  }
}
