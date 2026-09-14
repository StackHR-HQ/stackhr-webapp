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

const LAST_LOGIN_HINT_KEY = 'stackhr.last-login'

export interface LastLoginHint {
  orgSlug: string
  email: string
}

export function getLastLoginHint(): LastLoginHint | null {
  try {
    const value = JSON.parse(localStorage.getItem(LAST_LOGIN_HINT_KEY) ?? 'null') as Partial<LastLoginHint> | null
    return value?.orgSlug && value.email ? { orgSlug: value.orgSlug, email: value.email } : null
  } catch {
    return null
  }
}

function saveLastLoginHint(user: AuthUser): void {
  localStorage.setItem(LAST_LOGIN_HINT_KEY, JSON.stringify({ orgSlug: user.orgSlug, email: user.email }))
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  rememberMe: boolean
  setSession: (session: AuthSession, rememberMe: boolean) => void
  clearSession: () => void
  switchOrg: (org: { orgSlug: string; orgName: string }) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      rememberMe: false,
      setSession: ({ user, token }, rememberMe) => {
        saveLastLoginHint(user)
        set({ user, token, rememberMe })
      },
      clearSession: () => {
        const user = useAuthStore.getState().user
        if (user) saveLastLoginHint(user)
        set({ user: null, token: null, rememberMe: false })
      },
      switchOrg: (org) => set((state) => (state.user ? { user: { ...state.user, ...org } } : state)),
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
