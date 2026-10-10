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
    ws: false,
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
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("leaflet")) {
              return "vendor-leaflet";
            }
            if (id.includes("@googlemaps")) {
              return "vendor-maps";
            }
            if (id.includes("@tanstack")) {
              return "vendor-query";
            }
            if (id.includes("lucide-react") || id.includes("react-icons")) {
              return "vendor-icons";
            }
            if (id.includes("@radix-ui") || id.includes("class-variance-authority") || id.includes("tailwind-merge")) {
              return "vendor-ui";
            }
            return "vendor";
          }
          if (id.includes("suburbsData")) {
            return "suburbs-data";
          }
        },
      },
    },
  },
});
