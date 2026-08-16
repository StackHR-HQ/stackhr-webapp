import { createContext } from 'react'

export interface SidebarContextValue {
  collapsed: boolean
  toggleCollapsed: () => void
}

export const SidebarContext = createContext<SidebarContextValue | null>(null)
