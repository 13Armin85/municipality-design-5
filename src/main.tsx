import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { registerSW } from "virtual:pwa-register";
import { AuthProvider } from "./app/components/AuthContext";
import App from "./app/App.tsx";
import { installRequestFetchCache } from "./app/utils/requestCache";
import "./styles/index.css";

const normalizeRouterBasename = (value?: string) => {
  const trimmedValue = value?.trim();
  if (!trimmedValue || trimmedValue === "/" || trimmedValue === "./") {
    return undefined;
  }

  return `/${trimmedValue.replace(/^\/+|\/+$/g, "")}`;
};

const routerBasename =
  normalizeRouterBasename(import.meta.env.VITE_ROUTER_BASENAME) ??
  normalizeRouterBasename(import.meta.env.BASE_URL);

installRequestFetchCache();
registerSW({ immediate: true });

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename={routerBasename}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>,
);
