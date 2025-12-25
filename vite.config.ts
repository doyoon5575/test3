
import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    // 빌드 타임에 process.env가 정의되지 않아 발생하는 에러 방지
    'process.env': '({})'
  },
  build: {
    outDir: 'dist',
    target: 'esnext'
  }
});
