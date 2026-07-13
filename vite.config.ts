import { defineConfig, loadEnv } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

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

const normalizeAppBase = (value?: string) => {
  const trimmedValue = value?.trim();
  if (!trimmedValue) return "/";
  if (trimmedValue === "./" || trimmedValue === "/") return trimmedValue;

  return `/${trimmedValue.replace(/^\/+|\/+$/g, "")}/`;
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
  const appBase = normalizeAppBase(env.VITE_APP_BASE);
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
    base: appBase,

    plugins: [
      figmaAssetResolver(),
      react(),
      tailwindcss(),
      VitePWA({
        injectRegister: "auto",
        registerType: "autoUpdate",
        includeAssets: [
          "pwa/apple-touch-icon.png",
          "pwa/icon-192.png",
          "pwa/icon-512.png",
        ],
        manifest: {
          name: "شهروندیار آمل",
          short_name: "شهروندیار",
          description: "پرتال خدمات شهری شهرداری آمل",
          id: ".",
          lang: "fa",
          dir: "rtl",
          start_url: ".",
          scope: ".",
          display: "standalone",
          display_override: ["standalone", "minimal-ui"],
          orientation: "portrait-primary",
          background_color: "#ffffff",
          theme_color: "#14532d",
          categories: ["government", "utilities", "productivity"],
          icons: [
            {
              src: "pwa/icon-192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "pwa/icon-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "pwa/icon-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
          ],
        },
        devOptions: {
          enabled: false,
          suppressWarnings: true,
          navigateFallback: "index.html",
        },
        workbox: {
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
          globPatterns: [
            "**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,woff,woff2}",
          ],
          navigateFallback: "index.html",
          navigateFallbackDenylist: [
            /^\/api(?:\/|$)/,
            /^\/dotnet10-api(?:\/|$)/,
          ],
          runtimeCaching: [
            {
              urlPattern: ({ url }) =>
                url.pathname === "/api" ||
                url.pathname.startsWith("/api/") ||
                url.pathname === "/dotnet10-api" ||
                url.pathname.startsWith("/dotnet10-api/"),
              handler: "NetworkOnly",
              method: "GET",
              options: {
                cacheName: "api-network-only",
              },
            },
            {
              urlPattern: ({ request, sameOrigin }) =>
                sameOrigin && request.destination === "image",
              handler: "CacheFirst",
              options: {
                cacheName: "local-images",
                expiration: {
                  maxEntries: 80,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
              },
            },
          ],
        },
      }),
    ],

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
