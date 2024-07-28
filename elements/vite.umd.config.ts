import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist/umd',
    lib: {
      entry: 'src/index.ts',
      formats: ['umd'],
      name: 'xb-onepiece-elements',
      fileName: 'index'
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        '@fortawesome/fontawesome-svg-core',
        '@fortawesome/free-solid-svg-icons',
        '@fortawesome/react-fontawesome',
        'axios'
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@fortawesome/fontawesome-svg-core': 'fontawesome',
          '@fortawesome/free-solid-svg-icons': 'freeSolidIcons',
          '@fortawesome/react-fontawesome': 'reactFontawesome',
          axios: 'axios'
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'styles.css') {
            return 'index.css';
          }
          return assetInfo.name as string;
        }
        // manualChunks(id) {
        //   if (id.match(/packages\/components\/(.*?)\.ts/)) {
        //     return id.match(/packages\/components\/(.*?)\.ts/)?.[1] as string;
        //   }
        // }
      }
    }
  }
});
