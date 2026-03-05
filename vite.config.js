import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

function nonBlockingCssPlugin() {
  return {
    name: "non-blocking-css",
    apply: "build",
    enforce: "post",
    transformIndexHtml(html) {
      return html.replace(
        /<link\b[^>]*rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/g,
        (_match, href) =>
          `<link rel="preload" as="style" href="${href}"><link rel="stylesheet" href="${href}" media="print" onload="this.media='all'"><noscript><link rel="stylesheet" href="${href}"></noscript>`
      );
    }
  };
}

export default defineConfig({
  base: "/",
  plugins: [react(), nonBlockingCssPlugin()],
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
