import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (
            id.includes("/node_modules/react/") ||
            id.includes("/node_modules/react-dom/") ||
            id.includes("/node_modules/react-router/") ||
            id.includes("/node_modules/react-router-dom/")
          ) {
            return "vendor-react";
          }

          if (id.includes("/node_modules/lucide-react/")) {
            return "vendor-icons";
          }

          if (id.includes("/node_modules/@radix-ui/")) {
            return "vendor-radix";
          }

          if (id.includes("/node_modules/sonner/")) {
            return "vendor-notify";
          }

          if (/\/node_modules\/(react-markdown|remark-|micromark|mdast-|unist-|hast-|unified|vfile|bail|trough|zwitch|ccount|comma-separated-tokens|space-separated-tokens|property-information|stringify-entities|character-entities|decode-named-character-reference|longest-streak|markdown-table|is-plain-obj|trim-lines|html-void-elements|web-namespaces)/.test(id)) {
            return undefined;
          }

          return "vendor";
        },
      },
    },
  },
});
