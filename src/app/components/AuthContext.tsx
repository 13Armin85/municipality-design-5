import { createContext, useContext, ReactNode, useState, useEffect } from "react";

const AUTH_STORAGE_KEY = "municipality-user-authenticated";
const JUST_LOGGED_IN_KEY = "just-logged-in";

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
        sessionStorage.setItem(JUST_LOGGED_IN_KEY, "true");
        // Dispatch custom event for navigation handling
        window.dispatchEvent(new CustomEvent("user-logged-in"));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  };

  // Check for just-logged-in on mount and dispatch navigation event
  useEffect(() => {
    if (typeof window !== "undefined") {
      const justLoggedIn = sessionStorage.getItem(JUST_LOGGED_IN_KEY);
      if (justLoggedIn === "true" && isAuthenticated) {
        sessionStorage.removeItem(JUST_LOGGED_IN_KEY);
        window.location.href = "/my-property";
      }
    }
  }, []);

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
