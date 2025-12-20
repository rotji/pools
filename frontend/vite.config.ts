import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  optimizeDeps: {
    include: ['buffer'],
  },
  define: {
    'global': 'window',
  },
  build: {
    rollupOptions: {
      plugins: [
        {
          name: 'polyfill-buffer',
          setup(build) {
            build.onResolve({ filter: /^buffer$/ }, args => ({ path: require.resolve('buffer/') }));
          },
        },
      ],
    },
  },
});
