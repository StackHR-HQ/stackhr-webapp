import { PROFILE_TABS, type ProfileTabKey } from '../../lib/profile-tabs-data'

export function ProfileTabs({ active, onChange }: { active: ProfileTabKey; onChange: (key: ProfileTabKey) => void }) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-line">
      {PROFILE_TABS.map((tab) => {
        const isActive = tab.key === active
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`shrink-0 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
