"use client";

import {
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { AuthContextType, User } from "@/types/auth";
import { saveToken, getToken, removeToken } from "./auth-storage";

export const AuthContext = createContext<AuthContextType | null>(null);

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ------------------------
  // Load user on refresh
  // ------------------------
  useEffect(() => {
    const init = async () => {
      const storedToken = getToken();

      if (!storedToken) {
        setLoading(false);
        return;
      }

      setToken(storedToken);

      try {
        const res = await fetch("/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        const json = await res.json();

        if (json.success) {
          setUser(json.data);
        } else {
          removeToken();
          setToken(null);
        }
      } catch {
        removeToken();
        setToken(null);
      }

      setLoading(false);
    };

    init();
  }, []);

  // ------------------------
  // Login
  // ------------------------
  async function login(
    email: string,
    password: string
  ): Promise<boolean> {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      });

      const json = await res.json();

      if (!json.success) {
        return false;
      }

      saveToken(json.data.token);

      setToken(json.data.token);

      setUser(json.data.user);

      return true;
    } catch {
      return false;
    }
  }

  // ------------------------
  // Register
  // ------------------------
  async function register(
    name: string,
    email: string,
    phone: string,
    password: string
  ): Promise<boolean> {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          email,
          phone,
          password,
        }),
      });

     const json = await res.json();

console.log("REGISTER RESPONSE:", json);

if (!json.success) {
  throw new Error(
    json.message ||
    Object.values(json.errors ?? {})
      .flat()
      .join(", ")
  );
}

      saveToken(json.data.token);

      setToken(json.data.token);

      setUser(json.data.user);

      return true;
    } catch {
      return false;
    }
  }

  // ------------------------
  // Logout
  // ------------------------
  function logout() {
    removeToken();

    setUser(null);

    setToken(null);
  }

  // ------------------------
  // Refresh Profile
  // ------------------------
  async function refreshProfile() {
    if (!token) return;

    try {
      const res = await fetch("/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      if (json.success) {
        setUser(json.data);
      }
    } catch {}
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}