import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router'
import { SidebarContext } from './sidebar-context-value'

const STORAGE_KEY = 'stackhr.sidebar.collapsed'

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(STORAGE_KEY) === 'true')
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(collapsed))
  }, [collapsed])

  // Matches shadcn's sidebar keyboard shortcut.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'b') {
        event.preventDefault()
        setCollapsed((value) => !value)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // The mobile drawer is a one-shot overlay — close it whenever navigation happens.
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const toggleCollapsed = useCallback(() => setCollapsed((value) => !value), [])
  const toggleMobileOpen = useCallback(() => setMobileOpen((value) => !value), [])
  const closeMobile = useCallback(() => setMobileOpen(false), [])

  return (
    <SidebarContext.Provider value={{ collapsed, toggleCollapsed, mobileOpen, toggleMobileOpen, closeMobile }}>
      {children}
    </SidebarContext.Provider>
  )
}
