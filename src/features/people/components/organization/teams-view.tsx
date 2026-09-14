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
import { useCreateTeam } from '../../hooks/use-create-team'
import { useUpdateTeam } from '../../hooks/use-update-team'
import type { EmployeeSummary, Team } from '../../types/people-types'
import { AvatarStack } from './avatar-stack'

function TeamForm({ team, employees, onClose }: { team?: Team; employees: EmployeeSummary[]; onClose: () => void }) {
  const eligibleEmployees = employees.filter((employee) => employee.employmentStatus === 'active')
  const [name, setName] = useState(team?.name ?? '')
  const [description, setDescription] = useState(team?.description ?? '')
  const [memberIds, setMemberIds] = useState(team?.memberIds ?? [])
  const [leadEmployeeId, setLeadEmployeeId] = useState(team?.leadEmployeeId ?? '')
  const createTeam = useCreateTeam()
  const updateTeam = useUpdateTeam()
  const members = eligibleEmployees.filter((employee) => memberIds.includes(employee.id))
  const isSaving = createTeam.isPending || updateTeam.isPending
  const canSave = Boolean(name.trim() && description.trim() && leadEmployeeId && memberIds.includes(leadEmployeeId))

  function toggleMember(employeeId: string) {
    setMemberIds((current) => {
      const next = current.includes(employeeId) ? current.filter((id) => id !== employeeId) : [...current, employeeId]
      if (!next.includes(employeeId) && leadEmployeeId === employeeId) setLeadEmployeeId('')
      return next
    })
  }

  function saveTeam() {
    if (!canSave) return
    const payload = { name, description, leadEmployeeId, memberIds }
    const options = {
      onSuccess: () => { notify.success(team ? 'Team updated' : 'Team created'); onClose() },
      onError: (error: Error) => notify.error('Could not save team', getApiErrorMessage(error, 'Please try again.')),
    }
    if (team) updateTeam.mutate({ id: team.id, payload }, options)
    else createTeam.mutate(payload, options)
  }

  return <Card><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-medium text-ink">{team ? 'Edit team' : 'New team'}</p><p className="mt-0.5 text-xs text-muted">Teams can bring people together across departments.</p></div><button type="button" onClick={onClose} aria-label="Close team editor" className="rounded-md p-1 text-muted hover:bg-canvas hover:text-ink"><XIcon className="h-4 w-4" /></button></div><div className="mt-5 space-y-4"><TextField label="Team name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Customer launch" /><div><label htmlFor="team-description" className="mb-1.5 block text-sm font-medium text-ink">Description</label><textarea id="team-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What does this team work on?" rows={3} className="w-full resize-y rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40" /></div><SelectField label="Team lead" value={leadEmployeeId} onChange={(event) => setLeadEmployeeId(event.target.value)} placeholder="Choose a team member" options={members.map((employee) => ({ value: employee.id, label: `${employee.fullName} · ${employee.jobTitle}` }))} /><fieldset><legend className="mb-1.5 text-sm font-medium text-ink">Members</legend><p className="mb-2.5 text-xs text-muted">Only active employees can be assigned. Choose the lead from this list.</p><div className="max-h-52 space-y-1 overflow-y-auto rounded-lg border border-line bg-canvas p-1.5">{eligibleEmployees.map((employee) => { const checked = memberIds.includes(employee.id); return <label key={employee.id} className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 hover:bg-surface-2"><input type="checkbox" checked={checked} onChange={() => toggleMember(employee.id)} className="h-4 w-4 rounded border-line text-accent focus:ring-2 focus:ring-accent/40" /><Avatar initials={employee.avatarInitials} size="sm" /><span className="min-w-0"><span className="block truncate text-sm text-ink">{employee.fullName}</span><span className="block truncate text-xs text-muted">{employee.jobTitle}</span></span></label> })}</div></fieldset><Button type="button" onClick={saveTeam} loading={isSaving} disabled={!canSave}>{team ? 'Save team' : 'Create team'}</Button></div></Card>
}

export function TeamsView({ teams, employees, canManage }: { teams: Team[]; employees: EmployeeSummary[]; canManage: boolean }) {
  const [creating, setCreating] = useState(false)
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null)
  return <div className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><p className="max-w-xl text-sm text-muted">Use teams for the groups that work together, including cross-functional squads.</p>{canManage ? <Button type="button" className="w-auto! gap-2 px-5 py-3 text-base" onClick={() => { setCreating(true); setEditingTeamId(null) }}><PlusIcon className="h-5 w-5" />Add team</Button> : null}</div>{creating ? <TeamForm employees={employees} onClose={() => setCreating(false)} /> : null}{teams.length === 0 && !creating ? <Card><p className="text-sm font-medium text-ink">No teams yet</p><p className="mt-1 text-sm text-muted">{canManage ? 'Create a team to group people who work together.' : 'Teams will appear here when they are set up.'}</p></Card> : null}<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{teams.map((team) => { const members = employees.filter((employee) => team.memberIds.includes(employee.id)); const lead = employees.find((employee) => employee.id === team.leadEmployeeId); if (editingTeamId === team.id) return <TeamForm key={team.id} team={team} employees={employees} onClose={() => setEditingTeamId(null)} />; return <Card key={team.id}><div className="flex items-start justify-between gap-2"><div><p className="text-sm font-medium text-ink">{team.name}</p><p className="mt-0.5 text-xs text-muted">{team.description}</p></div>{canManage ? <button type="button" onClick={() => { setEditingTeamId(team.id); setCreating(false) }} aria-label={`Edit ${team.name}`} className="rounded-md p-1.5 text-muted hover:bg-canvas hover:text-ink"><PencilSimpleIcon className="h-4 w-4" /></button> : null}</div>{lead ? <Link to={`/people/employees/${lead.id}`} className="mt-4 flex items-center gap-2.5 rounded-lg border border-line bg-canvas p-2.5 hover:bg-surface-2"><Avatar initials={lead.avatarInitials} size="sm" /><span className="min-w-0"><span className="block truncate text-xs text-muted">Team lead</span><span className="block truncate text-sm font-medium text-ink">{lead.fullName}</span></span></Link> : <p className="mt-4 rounded-lg border border-dashed border-line px-2.5 py-3 text-xs text-muted">No team lead assigned</p>}<div className="mt-4 flex items-center justify-between"><AvatarStack members={members} /><span className="text-xs text-muted">{members.length} member{members.length === 1 ? '' : 's'}</span></div></Card> })}</div></div>
}
