import { useEffect, useState, type ReactNode } from 'react'
import { SidebarContext } from './sidebar-context-value'

const STORAGE_KEY = 'stackhr.sidebar.collapsed'

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(STORAGE_KEY) === 'true')

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

  return (
    <SidebarContext.Provider value={{ collapsed, toggleCollapsed: () => setCollapsed((value) => !value) }}>
      {children}
    </SidebarContext.Provider>
  )
}
