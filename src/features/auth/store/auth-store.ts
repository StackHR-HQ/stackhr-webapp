import { create } from 'zustand'
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware'
import { AUTH_STORAGE_KEY } from '../auth-constants'
import type { AuthSession, AuthUser } from '../types/auth-types'

// "Remember me" decides where the session lives: checked -> localStorage
// (survives browser restarts), unchecked -> sessionStorage (cleared when the
// tab/browser closes). Both are checked on read so a session started with
// one setting is still found after the app reloads.
const rememberAwareStorage: StateStorage = {
  getItem: (name) => localStorage.getItem(name) ?? sessionStorage.getItem(name),
  setItem: (name, value) => {
    const rememberMe = (JSON.parse(value)?.state?.rememberMe ?? false) as boolean
    if (rememberMe) {
      sessionStorage.removeItem(name)
      localStorage.setItem(name, value)
    } else {
      localStorage.removeItem(name)
      sessionStorage.setItem(name, value)
    }
  },
  removeItem: (name) => {
    localStorage.removeItem(name)
    sessionStorage.removeItem(name)
  },
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  rememberMe: boolean
  setSession: (session: AuthSession, rememberMe: boolean) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      rememberMe: false,
      setSession: ({ user, token }, rememberMe) => set({ user, token, rememberMe }),
      clearSession: () => set({ user: null, token: null, rememberMe: false }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => rememberAwareStorage),
    },
  ),
)

export function getStoredAuthToken(): string | null {
  return useAuthStore.getState().token
}
