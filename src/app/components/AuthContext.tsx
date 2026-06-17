import { createContext, useContext, ReactNode, useState } from "react";
import { AUTH_STORAGE_KEY } from "../utils/authStorage";

interface AuthContextType {
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (authenticated: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(AUTH_STORAGE_KEY) === "true";
  });

  const handleSetIsAuthenticated = (authenticated: boolean) => {
    setIsAuthenticated(authenticated);
    if (typeof window !== "undefined") {
      if (authenticated) {
        localStorage.setItem(AUTH_STORAGE_KEY, "true");
        window.dispatchEvent(new CustomEvent("user-logged-in"));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoginModalOpen,
        setIsLoginModalOpen,
        isAuthenticated,
        setIsAuthenticated: handleSetIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthModal must be used within AuthProvider");
  }
  return context;
}
