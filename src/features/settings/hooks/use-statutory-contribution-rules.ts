import { useQuery } from '@tanstack/react-query'
import { settingsService } from '../api/settings-service'

export function useStatutoryContributionRules() {
  return useQuery({
    queryKey: ['settings', 'payroll', 'statutory-contributions'],
    queryFn: () => settingsService.getStatutoryContributionRules(),
  })
}
