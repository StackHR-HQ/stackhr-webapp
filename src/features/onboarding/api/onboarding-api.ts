import { toApiEnum } from '../../../lib/api-enum'
import { getApiErrorMessage, http } from '../../../lib/http'
import { invitationsApi } from '../../invitations/api/invitations-api'
import {
  OnboardingError,
  type CompleteOnboardingPayload,
  type CompleteOnboardingResult,
} from '../types/onboarding-types'

export const onboardingApi = {
  async completeOnboarding({ companyInfo, employees }: CompleteOnboardingPayload): Promise<CompleteOnboardingResult> {
    try {
      await http.patch('/onboarding/company', {
        companyName: companyInfo.name,
        industry: companyInfo.industry,
        companySize: companyInfo.companySize,
        currency: companyInfo.currency,
        payrollFrequency: toApiEnum(companyInfo.payrollFrequency),
      })
    } catch (error) {
      throw new OnboardingError(getApiErrorMessage(error))
    }

    for (const employee of employees) {
      try {
        await http.post('/onboarding/employees', {
          fullName: employee.fullName,
          email: employee.email,
          department: employee.department,
          jobTitle: employee.jobTitle,
          employmentType: toApiEnum(employee.employmentType),
          salary: employee.salary,
          startDate: employee.startDate,
        })
      } catch (error) {
        throw new OnboardingError(`Couldn't add ${employee.fullName}: ${getApiErrorMessage(error)}`)
      }
    }

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
