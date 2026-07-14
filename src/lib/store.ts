"use client"

import { create } from "zustand"
import type { User } from "@/types"

interface AuthState {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  logout: () => void
  loadAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("trustlink_token", token)
      localStorage.setItem("trustlink_user", JSON.stringify(user))
    }
    set({ user, token })
  },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("trustlink_token")
      localStorage.removeItem("trustlink_user")
    }
    set({ user: null, token: null })
  },
  loadAuth: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("trustlink_token")
      const userStr = localStorage.getItem("trustlink_user")
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr) as User
          set({ user, token })
        } catch {
          localStorage.removeItem("trustlink_token")
          localStorage.removeItem("trustlink_user")
        }
      }
    }
  },
}))
