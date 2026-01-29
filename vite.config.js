import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd())

  return {
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: env.VITE_API_BASE_URL || 'http://localhost:5000',
        changeOrigin: true
      }
    },
    historyApiFallback: true
  }
  }
})