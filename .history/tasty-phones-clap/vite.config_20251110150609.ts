import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    "process.env.REFINE_DEVTOOLS": false,
    // Disable Refine telemetry (avoid calls to telemetry.refine.dev)
    "process.env.REFINE_DISABLE_TELEMETRY": true,
    // fallback flag some refine versions check
    "process.env.REFINE_TELEMETRY": false,
  },
  // Disable HMR overlay to avoid the red error overlay when Vite can't resolve a module
  // The overlay doesn't prevent the dev server from running but can be noisy.
  server: {
    hmr: {
      overlay: false,
    },
    proxy: {
      // Proxy API requests during development to the Laravel backend to avoid CORS
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
        // rewrite path keeps /api prefix when forwarding
        rewrite: (path) => path,
      },
    },
  },
});
