import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      outDir: 'types',
      root: 'dist'
    })
  ],
  build: {
    outDir: 'dist/es',
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      name: 'xb-onepiece-elements',
      fileName: 'index'
    },
    minify: false,
    cssCodeSplit: true,
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@fortawesome/fontawesome-svg-core',
        '@fortawesome/free-solid-svg-icons',
        '@fortawesome/react-fontawesome',
        'axios'
      ],
      output: {
        chunkFileNames: '[name].js',
        entryFileNames: '[name].js',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          '@fortawesome/fontawesome-svg-core': 'fontawesome',
          '@fortawesome/free-solid-svg-icons': 'freeSolidIcons',
          '@fortawesome/react-fontawesome': 'reactFontawesome',
          axios: 'axios'
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'styles.css') {
            return 'index.css';
          }
          if (assetInfo.type === 'asset' && /\.(css)/.test(assetInfo.name as string)) {
            return `theme/${assetInfo.name}`;
          }
          return assetInfo.name as string;
        },
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor' as string;
          }

          if (id.includes('packages/utils')) {
            return 'utils' as string;
          }

          if (id.match(/packages\/components\/(.*?)\/index.ts/)?.[1]) {
            return id.match(/packages\/components\/(.*?)\/index.ts/)?.[1] as string;
          }
        }
      }
    }
  }
});
