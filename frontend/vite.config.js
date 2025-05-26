import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
  server: {
    proxy: {
      // Configure your API endpoints here
      "/api": {
        target: "http://localhost:5000", // Your API server address
        changeOrigin: true,
        secure: false,
        // Optionally rewrite the paths:
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
});
