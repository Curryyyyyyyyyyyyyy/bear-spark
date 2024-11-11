import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode,process.cwd())
  return {
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler', // or "modern"
        }
      },
    },
    resolve:{
      alias:{
        '@':path.resolve(__dirname, './src')
      }
    },
    server: {
      proxy: {
        [env.VITE_BASE_URL]: {
          target: env.VITE_PROXY_DOMAIN,
          changeOrigin: true,
        }
      }
    },
  }
})
