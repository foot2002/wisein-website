import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Vercel 배포인지 확인 (환경 변수로 구분)
  const isVercel = process.env.VERCEL === '1';
  // GitHub Pages인지 확인
  const isGitHubPages = process.env.GITHUB_PAGES === '1';
  
  // base path 설정
  let base = '/';
  if (mode === "production" && isGitHubPages) {
    base = "/wisein-website/";
  }
  
  return {
    base,
    server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  };
});
