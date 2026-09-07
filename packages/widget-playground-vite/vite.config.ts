import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    nodePolyfills({
      include: ['buffer'],
      globals: {
        Buffer: true,
        global: true,
        process: false,
      },
    }),
    react(),
  ],
  esbuild: {
    target: 'esnext',
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      external: [],
    },
  },
  optimizeDeps: {
    include: ['axios'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: false,
          buffer: true,
        }),
      ],
    },
    exclude: ['@de1/widget-playground']
  },
  server: {
    port: 3000,
    open: true,
    fs: {
      allow: ['..']
    }
  },
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
})
