import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        bio: resolve(__dirname, "bio/index.html"),
        merch: resolve(__dirname, "merch/index.html")
      }
    }
  }
});
