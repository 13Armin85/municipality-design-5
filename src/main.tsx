import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./app/components/AuthContext";
import App from "./app/App.tsx";
import { installRequestFetchCache } from "./app/utils/requestCache";
import "./styles/index.css";

installRequestFetchCache();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>,
);
