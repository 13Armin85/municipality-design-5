import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

function figmaAssetResolver() {
  return {
    name: "figma-asset-resolver",

    resolveId(id: string) {
      if (id.startsWith("figma:asset/")) {
        const filename = id.replace("figma:asset/", "");

        return path.resolve(__dirname, "src/assets", filename);
      }
    },
  };
}

export default defineConfig({
  plugins: [figmaAssetResolver(), react(), tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    host: "0.0.0.0",
    port: 5173,

    proxy: {
      "/dotnet10-api": {
        target: "http://192.168.10.3:6500",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/dotnet10-api/, ""),
      },
      "/api": {
        target: "http://192.168.10.3:6300",

        changeOrigin: true,

        secure: false,

        ws: true,

        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },

  assetsInclude: ["**/*.svg", "**/*.csv"],
});
