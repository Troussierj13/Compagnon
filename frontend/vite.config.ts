import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
const { resolve } = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: "index.html",
      output: {
          entryFileNames: `assets/[name].js`,
          chunkFileNames: `assets/[name].js`,
          assetFileNames: `assets/[name].[ext]`
      },
      external: ['vue', 'vuetify']
    }
  },
});