import { Card, CardHeader } from '../../../../components/ui/card'

export function AddressView() {
  return (
    <Card>
      <CardHeader title="Address" description="Your registered business address, used on payslips and compliance filings." />
      <p className="text-sm text-muted">Address details are not yet available in the Organization API and cannot be edited here.</p>
    </Card>
  )
}
