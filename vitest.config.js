import tsconfigPaths from 'vite-tsconfig-paths'
import * as path from 'path'

export default {
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'istanbul' // or 'c8'
    }
  },
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, '.')
    }
  }
}
