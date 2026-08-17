import { Card, CardHeader } from '../../../../components/ui/card'
import { formatDate } from '../../lib/format'
import type { EmployeeDetail } from '../../types/people-types'
import { FieldGrid } from './field-grid'

export function PersonalInfoTab({ employee }: { employee: EmployeeDetail }) {
  const { personalInfo } = employee

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <Card>
        <CardHeader title="Personal details" />
        <FieldGrid
          fields={[
            { label: 'Date of birth', value: formatDate(personalInfo.dateOfBirth) },
            { label: 'Gender', value: personalInfo.gender },
            { label: 'Marital status', value: personalInfo.maritalStatus },
            { label: 'Nationality', value: personalInfo.nationality },
            { label: 'Phone', value: personalInfo.phone },
            { label: 'Email', value: employee.email },
            { label: 'Address', value: personalInfo.address },
          ]}
        />
      </Card>

      <Card>
        <CardHeader title="Emergency contact" />
        <FieldGrid
          fields={[
            { label: 'Name', value: personalInfo.emergencyContactName },
            { label: 'Relationship', value: personalInfo.emergencyContactRelationship },
            { label: 'Phone', value: personalInfo.emergencyContactPhone },
          ]}
        />
      </Card>
    </div>
  )
}
