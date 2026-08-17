import { http } from '../../../lib/http'
import type { Department, EmployeeDetail, EmployeeSummary, Team } from '../types/people-types'

// Real backend calls. Not wired up yet — the endpoints don't exist. Kept
// behind the same shape as people-mock-api.ts so people-service.ts can swap
// to this by flipping VITE_USE_MOCK_AUTH once the backend is live.
export const peopleApi = {
  async getEmployees(): Promise<EmployeeSummary[]> {
    const { data } = await http.get<EmployeeSummary[]>('/people/employees')
    return data
  },

  async getEmployee(id: string): Promise<EmployeeDetail | null> {
    const { data } = await http.get<EmployeeDetail>(`/people/employees/${id}`)
    return data
  },

  async getDepartments(): Promise<Department[]> {
    const { data } = await http.get<Department[]>('/people/departments')
    return data
  },

  async getTeams(): Promise<Team[]> {
    const { data } = await http.get<Team[]>('/people/teams')
    return data
  },
}
