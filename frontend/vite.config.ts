import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
const { resolve } = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      external: ['vue', 'vuetify']
    }
  },
});