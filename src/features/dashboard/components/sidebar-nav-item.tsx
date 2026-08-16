import { CaretRightIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router'
import { NAV_ICONS } from './nav-icon-map'
import type { NavSection } from './sidebar-nav-data'
import { useSidebar } from './use-sidebar'

export function SidebarNavItem({ section }: { section: NavSection }) {
  const { collapsed, toggleCollapsed } = useSidebar()
  const location = useLocation()
  const Icon = NAV_ICONS[section.icon]

  const hasActiveChild = section.items?.some((item) => location.pathname === item.path) ?? false
  const [expanded, setExpanded] = useState(hasActiveChild)

  if (!section.items) {
    return (
      <NavLink
        to={section.path!}
        end={section.path === '/'}
        title={collapsed ? section.label : undefined}
        className={({ isActive }) =>
          `flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm ${collapsed ? 'justify-center' : ''} ${
            isActive ? 'bg-surface font-medium text-ink' : 'text-muted hover:bg-surface hover:text-ink'
          }`
        }
      >
        <Icon className="h-4 w-4 shrink-0" />
        {!collapsed ? <span className="truncate">{section.label}</span> : null}
      </NavLink>
    )
  }

  return (
    <div>
      <button
        type="button"
        title={collapsed ? section.label : undefined}
        onClick={() => {
          if (collapsed) {
            // Nothing to expand into while collapsed — open the rail and the group together.
            toggleCollapsed()
            setExpanded(true)
          } else {
            setExpanded((value) => !value)
          }
        }}
        className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-muted hover:bg-surface hover:text-ink ${
          collapsed ? 'justify-center' : ''
        }`}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {!collapsed ? (
          <>
            <span className="flex-1 truncate text-left">{section.label}</span>
            <CaretRightIcon className={`h-3.5 w-3.5 shrink-0 transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </>
        ) : null}
      </button>

      {!collapsed && expanded ? (
        <ul className="ml-[1.15rem] mt-0.5 space-y-0.5 border-l border-line pl-3">
          {section.items.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `block truncate rounded-lg px-2.5 py-1.5 text-sm ${
                    isActive ? 'font-medium text-ink' : 'text-muted hover:text-ink'
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
