import path from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'
import Vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'

export default {
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'istanbul' // or 'c8'
    }
  },
  plugins: [tsconfigPaths(), Vue(), AutoImport({ imports: ['vue'] })],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, '.')
    }
  }
}
