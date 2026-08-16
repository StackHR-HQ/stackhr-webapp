import { create } from 'zustand'
import type { CompanyInfo, EmployeeDraft, NewEmployeeDraft } from '../types/onboarding-types'

interface OnboardingState {
  companyInfo: CompanyInfo | null
  employees: EmployeeDraft[]
  setCompanyInfo: (info: CompanyInfo) => void
  addEmployee: (employee: NewEmployeeDraft) => void
  addEmployees: (employees: NewEmployeeDraft[]) => void
  removeEmployee: (id: string) => void
  reset: () => void
}

function createEmployeeId(): string {
  return crypto.randomUUID()
}

export const useOnboardingStore = create<OnboardingState>()((set) => ({
  companyInfo: null,
  employees: [],
  setCompanyInfo: (info) => set({ companyInfo: info }),
  addEmployee: (employee) =>
    set((state) => ({ employees: [...state.employees, { ...employee, id: createEmployeeId() }] })),
  addEmployees: (employees) =>
    set((state) => ({
      employees: [...state.employees, ...employees.map((employee) => ({ ...employee, id: createEmployeeId() }))],
    })),
  removeEmployee: (id) =>
    set((state) => ({
      employees: state.employees
        .filter((employee) => employee.id !== id)
        // Clear dangling manager references left by the removed employee.
        .map((employee) => (employee.managerId === id ? { ...employee, managerId: undefined } : employee)),
    })),
  reset: () => set({ companyInfo: null, employees: [] }),
}))
