import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages는 https://<user>.github.io/<repo>/ 하위 경로에 배포되므로
// base를 저장소 이름에 맞춰야 정적 자산 경로가 올바르게 동작합니다.
// 저장소 이름을 바꾸면 아래 기본값을 함께 바꾸거나,
// 빌드 시 VITE_BASE 환경 변수로 덮어쓸 수 있습니다. (예: VITE_BASE=/my-repo/ npm run build)
const base = process.env.VITE_BASE ?? '/newstory/';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'serve' ? '/' : base,
}));
