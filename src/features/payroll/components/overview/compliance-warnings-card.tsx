import { Card, CardHeader } from '../../../../components/ui/card'
import { ComplianceWarningsList } from '../compliance-warnings-list'
import type { ComplianceWarning } from '../../types/payroll-types'

export function ComplianceWarningsCard({ warnings }: { warnings: ComplianceWarning[] }) {
  return (
    <Card>
      <CardHeader title="Compliance warnings" />
      <ComplianceWarningsList warnings={warnings} />
    </Card>
  )
}
