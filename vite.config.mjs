import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ADMIN_SRC = "/src/admin/";
const isAdminOnly = (ids = []) => ids.length > 0 && ids.every((id) => id.split(path.sep).join("/").includes(ADMIN_SRC));

const adminPages = () => {
  const rewrite = (req, _res, next) => {
    const url = (req.url || "").split("?")[0];
    if (/^\/admin(\/[^.]*)?$/.test(url)) req.url = "/admin/index.html";
    next();
  };
  return {
    name: "admin-pages",
    configureServer(server) {
      server.middlewares.use(rewrite);
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewrite);
    },
  };
};

export default defineConfig({
  plugins: [react(), adminPages()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        admin: path.resolve(__dirname, "admin/index.html"),
      },
      output: {
        entryFileNames: (chunk) => (chunk.name === "admin" ? "admin/assets/[name]-[hash].js" : "assets/[name]-[hash].js"),
        chunkFileNames: (chunk) => (isAdminOnly(chunk.moduleIds) ? "admin/assets/[name]-[hash].js" : "assets/[name]-[hash].js"),
        assetFileNames: (asset) => {
          const name = asset.names?.[0] || asset.name || "";
          return name.startsWith("admin") ? "admin/assets/[name]-[hash][extname]" : "assets/[name]-[hash][extname]";
        },
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
