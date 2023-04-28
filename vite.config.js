import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: "Aryesh's Chat-A-Lot",
        short_name: "Chat-A-Lot",
        theme_color: "#000000",
        background_color: "#000000",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "./assets/maskable_icon.png",
            sizes: "196x196",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "./assets/logo192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "./assets/logo256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "./assets/logo384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "./assets/logo512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
      },
    }),
  ],
  optimizeDeps: {
    // include: ['linked-dep'],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      // include: [/linked-dep/, /node_modules/],
    },
    base: "/",
    ssr: false,
  },
});
