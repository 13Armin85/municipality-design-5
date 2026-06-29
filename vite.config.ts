import { defineConfig, loadEnv } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const DEFAULT_API_BASE_URL = "http://192.168.10.3:6300";
const DEFAULT_DOTNET10_API_BASE_URL = "http://192.168.10.3:6500";

const readEnvUrl = (
  env: Record<string, string>,
  keys: string[],
  fallback: string,
) => {
  for (const key of keys) {
    const value = env[key]?.trim().replace(/\/+$/, "");
    if (value) return value;
  }

  return fallback;
};

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

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiProxyTarget = readEnvUrl(
    env,
    ["VITE_API_PROXY_TARGET", "VITE_API_BASE_URL", "VITE_API_URL"],
    DEFAULT_API_BASE_URL,
  );
  const dotNet10ApiProxyTarget = readEnvUrl(
    env,
    [
      "VITE_DOTNET10_API_PROXY_TARGET",
      "VITE_DOTNET10_API_BASE_URL",
      "VITE_DOTNET10_API_URL",
    ],
    DEFAULT_DOTNET10_API_BASE_URL,
  );

  return {
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
          target: dotNet10ApiProxyTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/dotnet10-api/, ""),
        },
        "/api": {
          target: apiProxyTarget,

          changeOrigin: true,

          secure: false,

          ws: true,

          rewrite: (path) => path.replace(/^\/api/, "/api"),
        },
      },
    },

    assetsInclude: ["**/*.svg", "**/*.csv"],
  };
});
