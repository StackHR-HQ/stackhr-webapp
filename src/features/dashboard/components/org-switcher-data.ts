import { BuildingsIcon, StorefrontIcon, TruckIcon, type Icon } from '@phosphor-icons/react'

export interface OrganizationOption {
  orgSlug: string
  orgName: string
  icon: Icon
}

// Stands in for the real backend until multi-org membership exists — the
// mock auth session only ever logs into "acme", so switching here is
// display-only. Matches DEMO_LOGIN_CREDENTIALS.orgSlug in auth-mock-api.ts.
export const ORGANIZATIONS: OrganizationOption[] = [
  { orgSlug: 'acme', orgName: 'Acme Inc.', icon: BuildingsIcon },
  { orgSlug: 'lagos-retail-co', orgName: 'Lagos Retail Co.', icon: StorefrontIcon },
  { orgSlug: 'nairobi-freight', orgName: 'Nairobi Freight Ltd', icon: TruckIcon },
]
