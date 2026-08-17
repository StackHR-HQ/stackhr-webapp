import { EMPLOYEES, type EmployeeSeed } from '../../people/data/employees'

export function getEmployeesAsOf(payDate: string): EmployeeSeed[] {
  const cutoff = new Date(payDate).getTime()
  return EMPLOYEES.filter((employee) => new Date(employee.startDate).getTime() <= cutoff)
}
