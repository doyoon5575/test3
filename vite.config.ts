
import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    // process.env.API_KEY를 직접 정의하여 빌드 타임에 주입
    // JSON.stringify를 통해 유효한 자바스크립트 문자열 리터럴로 변환
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    'process.env': '{}'
  },
  build: {
    outDir: 'dist',
    target: 'esnext'
  }
});
