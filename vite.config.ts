import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// https://vitejs.dev/config/
export default defineConfig({
  base: "/assets/build/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    origin: "http://localhost:8001",
    cors: true,
    strictPort: true,
    port: 8001,
  },
  build: {
    outDir: "./www/assets/build",
    emptyOutDir: true,
    manifest: true,
    target: "es2018",
    rollupOptions: {
      input: {
        main: "./src/main.tsx",
      },
    },
  },
})
