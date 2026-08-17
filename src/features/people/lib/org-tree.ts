import type { EmployeeSummary } from '../types/people-types'

export interface OrgTreeNode {
  employee: EmployeeSummary
  children: OrgTreeNode[]
}

export function buildOrgTree(employees: EmployeeSummary[]): OrgTreeNode[] {
  function childrenOf(managerId: string | null): OrgTreeNode[] {
    return employees
      .filter((employee) => employee.managerId === managerId)
      .map((employee) => ({ employee, children: childrenOf(employee.id) }))
  }

  return childrenOf(null)
}
