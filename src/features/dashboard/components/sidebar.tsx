import { NavLink, useNavigate } from 'react-router'
import { useAuthStore } from '../../auth/store/auth-store'
import { SIDEBAR_NAV } from './sidebar-nav-data'

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  `block rounded px-2 py-1 text-sm ${isActive ? 'bg-surface text-ink' : 'text-muted hover:text-ink'}`

export function Sidebar() {
  const clearSession = useAuthStore((state) => state.clearSession)
  const navigate = useNavigate()

  return (
    <nav className="flex w-56 shrink-0 flex-col justify-between border-r border-line p-4">
      <div>
        <p className="mb-4 px-2 text-sm font-medium text-ink">StackHR</p>
        <ul className="space-y-4">
        {SIDEBAR_NAV.map((section) =>
          section.items ? (
            <li key={section.label}>
              <p className="mb-1 px-2 text-xs font-medium uppercase tracking-wide text-muted">{section.label}</p>
              <ul>
                {section.items.map((item) => (
                  <li key={item.path}>
                    <NavLink to={item.path} className={linkClasses}>
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
          ) : (
            <li key={section.label}>
              <NavLink to={section.path!} end={section.path === '/'} className={linkClasses}>
                {section.label}
              </NavLink>
            </li>
          ),
        )}
        </ul>
      </div>

      <button
        type="button"
        onClick={() => {
          clearSession()
          navigate('/login', { replace: true })
        }}
        className="rounded px-2 py-1 text-left text-sm text-muted hover:text-ink"
      >
        Log out
      </button>
    </nav>
  )
}
