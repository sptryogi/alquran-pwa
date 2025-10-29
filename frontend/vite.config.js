import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Belajar Al-Qur'an",
        short_name: "QuranApp",
        start_url: ".",
        display: "standalone",
        theme_color: "#2e7d32",
        background_color: "#ffffff"
      }
    })
  ],

  build: {
    rollupOptions: {
      external: [
        'pdfjs-dist/build/pdf.worker.entry' // <-- Ini mencegah Rollup mencoba mencari file di luar node_modules
      ],
    },
  },
});
