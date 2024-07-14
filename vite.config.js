import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': '/src', // 경로는 상대 경로로 설정 가능
    }
  },
  define: {
    'process.env': {}, // 필요한 경우 환경 변수 설정
    global: {}, // 필요한 경우 전역 변수 설정
  }
});
