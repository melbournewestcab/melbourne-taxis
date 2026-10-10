import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  root: process.cwd(),
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    hmr: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"),
      "@workspace/api-client-react": path.resolve(process.cwd(), "lib/api-client-react/src"),
      "@workspace/api-zod": path.resolve(process.cwd(), "lib/api-zod/src"),
      "@workspace/db": path.resolve(process.cwd(), "lib/db/src"),
      "@assets": path.resolve(process.cwd(), "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  build: {
    outDir: path.resolve(process.cwd(), "dist"),
    emptyOutDir: true,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
          return;
        }
        warn(warning);
      },
    },
  },
});
