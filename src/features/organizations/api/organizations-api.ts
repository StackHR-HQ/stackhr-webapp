import { http } from '../../../lib/http'
import type { Organization } from '../types/organization-types'

export const organizationsApi = {
  async getOrganizations(): Promise<Organization[]> {
    const { data } = await http.get<Organization | Organization[]>('/organizations')
    return Array.isArray(data) ? data : [data]
  },
}
