import { DEPARTMENTS } from '../../people/data/departments'
import { EMPLOYEES } from '../../people/data/employees'
import type { SalaryBand } from '../types/payroll-types'

export function getSalaryBands(): SalaryBand[] {
  return DEPARTMENTS.map((department) => {
    const salaries = EMPLOYEES.filter((employee) => employee.departmentId === department.id).map(
      (employee) => employee.compensation.salary,
    )

    return {
      departmentId: department.id,
      departmentName: department.name,
      employeeCount: salaries.length,
      minSalary: Math.min(...salaries),
      maxSalary: Math.max(...salaries),
      avgSalary: salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length,
    }
  })
}

export function getEmployeeSalaryRows() {
  return EMPLOYEES.map((employee) => ({
    employeeId: employee.id,
    employeeName: employee.fullName,
    avatarInitials: employee.avatarInitials,
    jobTitle: employee.jobTitle,
    departmentId: employee.departmentId,
    annualSalary: employee.compensation.salary,
    monthlySalary: employee.compensation.salary / 12,
    currency: employee.compensation.currency,
    payFrequency: employee.compensation.payFrequency,
  }))
}
