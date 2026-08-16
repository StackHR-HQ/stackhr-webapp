import { createContext } from 'react'

export interface SidebarContextValue {
  collapsed: boolean
  toggleCollapsed: () => void
  mobileOpen: boolean
  toggleMobileOpen: () => void
  closeMobile: () => void
}

export const SidebarContext = createContext<SidebarContextValue | null>(null)
