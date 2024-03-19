import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173, // 您可以指定要监听的端口
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8081', // 后端服务器地址
        changeOrigin: true, // 是否改变请求源
        rewrite: (path) => path.replace(/^\/api/, '') // 重写请求路径
      }
    }
  }
});
