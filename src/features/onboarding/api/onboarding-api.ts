import { getApiErrorMessage, http } from '../../../lib/http'
import { invitationsApi } from '../../invitations/api/invitations-api'
import {
  OnboardingError,
  type CompanyInfo,
  type CompleteOnboardingPayload,
  type CompleteOnboardingResult,
} from '../types/onboarding-types'

interface OrganizationResponse {
  name: string
  logo: string | null
  industry: string | null
  companySize: string | null
  currency: string
  payrollFrequency: string
  taxId: string | null
}

const FREQUENCY_LABELS: Record<string, string> = { MONTHLY: 'Monthly', BIWEEKLY: 'Bi-weekly', WEEKLY: 'Weekly' }

function toCompanyInfo(organization: OrganizationResponse): CompanyInfo {
  return {
    name: organization.name,
    logoDataUrl: organization.logo ?? undefined,
    industry: organization.industry ?? '',
    companySize: organization.companySize ?? '',
    taxId: organization.taxId ?? undefined,
    currency: organization.currency,
    payrollFrequency: FREQUENCY_LABELS[organization.payrollFrequency] ?? organization.payrollFrequency,
  }
}

export const onboardingApi = {
  // Lets the wizard resume with what was already saved, e.g. after a refresh.
  async getCompanyInfo(): Promise<CompanyInfo | null> {
    try {
      const { data } = await http.get<OrganizationResponse>('/organizations/current')
      return toCompanyInfo(data)
    } catch {
      return null
    }
  },

  async updateCompanyInfo(company: CompanyInfo): Promise<CompanyInfo> {
    try {
      await http.patch('/onboarding/company', {
        companyName: company.name,
        industry: company.industry,
        companySize: company.companySize,
        currency: company.currency,
        payrollFrequency: company.payrollFrequency,
        taxId: company.taxId,
        logoDataUrl: company.logoDataUrl,
      })
    } catch (error) {
      throw new OnboardingError(getApiErrorMessage(error, 'Something went wrong saving company information.'))
    }
    return company
  },

  // One atomic transaction: saves company info and creates every employee
  // draft in a single call, confirmed live at POST /onboarding/complete.
  async completeOnboarding({ companyInfo, employees }: CompleteOnboardingPayload): Promise<CompleteOnboardingResult> {
    try {
      await http.post('/onboarding/complete', { companyInfo, employees })
    } catch (error) {
      throw new OnboardingError(getApiErrorMessage(error, 'Something went wrong. Please try again.'))
    }

    // Employees are created as PENDING_INVITATION only; the invite itself is
    // a separate call, sent best-effort so a failure here never blocks the
    // dashboard.
    const invitations = await Promise.allSettled(
      employees.map((employee) =>
        invitationsApi.sendInvitation({ email: employee.email, role: 'EMPLOYEE', department: employee.department }),
      ),
    )
    const failedInvitations = employees
      .filter((_, index) => invitations[index]?.status === 'rejected')
      .map((employee) => employee.email)

    return { failedInvitations }
  },
}
