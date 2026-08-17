import { USE_MOCK_AUTH } from '../../../lib/env'
import { mockPeopleApi } from './people-mock-api'
import { peopleApi } from './people-api'

export const peopleService = USE_MOCK_AUTH ? mockPeopleApi : peopleApi
