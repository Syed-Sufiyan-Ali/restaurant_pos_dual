"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  avatarUrl?: string;
}

interface AuthStore {
  user:    AuthUser | null;
  token:   string | null;
  isAuth:  boolean;
  setAuth: (user: AuthUser, token: string) => void;
  logout:  () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user:   null,
      token:  null,
      isAuth: false,
      setAuth: (user, token) => set({ user, token, isAuth: true }),
      logout:  ()            => set({ user: null, token: null, isAuth: false }),
    }),
    { name: "pizzatown-auth" }
  )
);
