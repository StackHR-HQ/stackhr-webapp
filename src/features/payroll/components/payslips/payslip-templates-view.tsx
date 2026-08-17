import { FileTextIcon } from '@phosphor-icons/react'
import { Card } from '../../../../components/ui/card'

export function PayslipTemplatesView() {
  return (
    <Card>
      <div className="flex flex-col items-center gap-2 py-10 text-center">
        <FileTextIcon className="h-6 w-6 text-muted" />
        <p className="text-sm font-medium text-ink">Payslip templates are coming soon</p>
        <p className="max-w-sm text-sm text-muted">
          Customizable payslip layouts and branding aren't available yet. Payslips currently use a single default
          format.
        </p>
      </div>
    </Card>
  )
}
