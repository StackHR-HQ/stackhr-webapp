import { Card, CardHeader } from '../../../../components/ui/card'
import { formatAmount } from '../../lib/format'
import type { EarningComponent, SalaryBand } from '../../types/payroll-types'

export function SalaryStructuresView({ components, bands }: { components: EarningComponent[]; bands: SalaryBand[] }) {
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader
          title="Compensation structure"
          description="Every salary splits into these components — Basic, Housing, and Transport together form the BHT base used for pension"
        />
        <div className="space-y-3">
          {components.map((component) => (
            <div key={component.id}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink">{component.name}</span>
                <span className="text-muted">{component.percentOfGross}%</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-pill bg-surface-2">
                <div className="h-full rounded-pill bg-accent" style={{ width: `${component.percentOfGross}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="Salary bands by department" />
        <div className="overflow-x-auto rounded-panel border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Department</th>
                <th className="px-4 py-3 font-medium">Employees</th>
                <th className="px-4 py-3 font-medium">Min</th>
                <th className="px-4 py-3 font-medium">Average</th>
                <th className="px-4 py-3 font-medium">Max</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {bands.map((band) => (
                <tr key={band.departmentId} className="bg-canvas">
                  <td className="px-4 py-3 font-medium text-ink">{band.departmentName}</td>
                  <td className="px-4 py-3 text-muted">{band.employeeCount}</td>
                  <td className="px-4 py-3 text-muted">{formatAmount(band.minSalary, 'NGN')}</td>
                  <td className="px-4 py-3 text-ink">{formatAmount(band.avgSalary, 'NGN')}</td>
                  <td className="px-4 py-3 text-muted">{formatAmount(band.maxSalary, 'NGN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
