import { PencilSimpleIcon, PlusIcon, XIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Link } from 'react-router'
import { Avatar } from '../../../../components/ui/avatar'
import { Button } from '../../../../components/ui/button'
import { Card } from '../../../../components/ui/card'
import { SelectField } from '../../../../components/ui/select-field'
import { TextField } from '../../../../components/ui/text-field'
import { getApiErrorMessage } from '../../../../lib/api-error'
import { notify } from '../../../../lib/toast'
import { useCreateDepartment } from '../../hooks/use-create-department'
import { useUpdateDepartment } from '../../hooks/use-update-department'
import type { Department, EmployeeSummary } from '../../types/people-types'
import { AvatarStack } from './avatar-stack'

function DepartmentForm({ department, employees, onClose }: { department?: Department; employees: EmployeeSummary[]; onClose: () => void }) {
  const initialMembers = department ? employees.filter((employee) => employee.departmentId === department.id).map((employee) => employee.id) : []
  const [name, setName] = useState(department?.name ?? '')
  const [memberIds, setMemberIds] = useState(initialMembers)
  const [headEmployeeId, setHeadEmployeeId] = useState<string | null>(department?.headEmployeeId ?? null)
  const createDepartment = useCreateDepartment()
  const updateDepartment = useUpdateDepartment()
  const isSaving = createDepartment.isPending || updateDepartment.isPending

  function toggleMember(employeeId: string) {
    setMemberIds((current) => {
      const next = current.includes(employeeId) ? current.filter((id) => id !== employeeId) : [...current, employeeId]
      if (!next.includes(employeeId) && headEmployeeId === employeeId) setHeadEmployeeId(null)
      return next
    })
  }

  function saveDepartment() {
    const payload = { name, headEmployeeId, memberIds }
    const options = {
      onSuccess: () => { notify.success(department ? 'Department updated' : 'Department created'); onClose() },
      onError: (error: Error) => notify.error('Could not save department', getApiErrorMessage(error, 'Please try again.')),
    }
    if (department) updateDepartment.mutate({ id: department.id, payload }, options)
    else createDepartment.mutate(payload, options)
  }

  const members = employees.filter((employee) => memberIds.includes(employee.id))
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div><p className="text-sm font-medium text-ink">{department ? 'Edit department' : 'New department'}</p><p className="mt-0.5 text-xs text-muted">Choose the lead and the people assigned to this department.</p></div>
        <button type="button" onClick={onClose} aria-label="Close department editor" className="rounded-md p-1 text-muted hover:bg-canvas hover:text-ink"><XIcon className="h-4 w-4" /></button>
      </div>
      <div className="mt-5 space-y-4">
        <TextField label="Department name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Customer Success" />
        <SelectField label="Department head" value={headEmployeeId ?? ''} onChange={(event) => setHeadEmployeeId(event.target.value || null)} options={[{ value: '', label: 'No department head' }, ...members.map((employee) => ({ value: employee.id, label: `${employee.fullName} · ${employee.jobTitle}` }))]} />
        <fieldset>
          <legend className="mb-1.5 text-sm font-medium text-ink">Members</legend>
          <p className="mb-2.5 text-xs text-muted">Assigning someone here moves them from their current department.</p>
          <div className="max-h-52 space-y-1 overflow-y-auto rounded-lg border border-line bg-canvas p-1.5">
            {employees.map((employee) => {
              const checked = memberIds.includes(employee.id)
              return <label key={employee.id} className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 hover:bg-surface-2"><input type="checkbox" checked={checked} onChange={() => toggleMember(employee.id)} className="h-4 w-4 rounded border-line text-accent focus:ring-2 focus:ring-accent/40" /><Avatar initials={employee.avatarInitials} size="sm" /><span className="min-w-0"><span className="block truncate text-sm text-ink">{employee.fullName}</span><span className="block truncate text-xs text-muted">{employee.jobTitle}</span></span></label>
            })}
          </div>
        </fieldset>
        <Button type="button" onClick={saveDepartment} loading={isSaving} disabled={!name.trim()}>{department ? 'Save department' : 'Create department'}</Button>
      </div>
    </Card>
  )
}

export function DepartmentsView({ departments, employees }: { departments: Department[]; employees: EmployeeSummary[] }) {
  const [creating, setCreating] = useState(false)
  const [editingDepartmentId, setEditingDepartmentId] = useState<string | null>(null)
  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><p className="max-w-xl text-sm text-muted">Set the departments your organization uses, then assign each department&apos;s head and members.</p><Button type="button" className="w-auto! gap-2 px-5 py-3 text-base" onClick={() => { setCreating(true); setEditingDepartmentId(null) }}><PlusIcon className="h-5 w-5" />Add department</Button></div>
      {creating ? <DepartmentForm employees={employees} onClose={() => setCreating(false)} /> : null}
      {departments.length === 0 && !creating ? <Card><p className="text-sm font-medium text-ink">No departments yet</p><p className="mt-1 text-sm text-muted">Create your first department to organize your team and reporting structure.</p></Card> : null}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {departments.map((department) => {
          const members = employees.filter((employee) => employee.departmentId === department.id)
          const head = employees.find((employee) => employee.id === department.headEmployeeId)
          if (editingDepartmentId === department.id) return <DepartmentForm key={department.id} department={department} employees={employees} onClose={() => setEditingDepartmentId(null)} />
          return <Card key={department.id}><div className="flex items-start justify-between gap-2"><div><p className="text-sm font-medium text-ink">{department.name}</p><p className="mt-0.5 text-xs text-muted">{members.length} member{members.length === 1 ? '' : 's'}</p></div><button type="button" onClick={() => { setEditingDepartmentId(department.id); setCreating(false) }} aria-label={`Edit ${department.name}`} className="rounded-md p-1.5 text-muted hover:bg-canvas hover:text-ink"><PencilSimpleIcon className="h-4 w-4" /></button></div>{head ? <Link to={`/people/employees/${head.id}`} className="mt-4 flex items-center gap-2.5 rounded-lg border border-line bg-canvas p-2.5 hover:bg-surface-2"><Avatar initials={head.avatarInitials} size="sm" /><span className="min-w-0"><span className="block truncate text-xs text-muted">Department head</span><span className="block truncate text-sm font-medium text-ink">{head.fullName}</span></span></Link> : <p className="mt-4 rounded-lg border border-dashed border-line px-2.5 py-3 text-xs text-muted">No department head assigned</p>}<div className="mt-4"><AvatarStack members={members} /></div></Card>
        })}
      </div>
    </div>
  )
}
