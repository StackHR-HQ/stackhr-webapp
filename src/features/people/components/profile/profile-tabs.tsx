import { UnderlineTabs } from '../../../../components/ui/underline-tabs'
import { PROFILE_TABS, type ProfileTabKey } from '../../lib/profile-tabs-data'

export function ProfileTabs({ active, onChange }: { active: ProfileTabKey; onChange: (key: ProfileTabKey) => void }) {
  return <UnderlineTabs tabs={PROFILE_TABS} active={active} onChange={onChange} />
}
