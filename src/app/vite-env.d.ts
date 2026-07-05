/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_API_URL?: string;
  readonly VITE_DEV_API_BASE_URL?: string;
  readonly VITE_API_PROXY_TARGET?: string;
  readonly VITE_DOTNET10_API_BASE_URL?: string;
  readonly VITE_DOTNET10_API_URL?: string;
  readonly VITE_DEV_DOTNET10_API_BASE_URL?: string;
  readonly VITE_DOTNET10_API_PROXY_TARGET?: string;
  readonly VITE_APP_BASE?: string;
  readonly VITE_ROUTER_BASENAME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
