import { USE_MOCK_AUTH } from '../../../lib/env'
import { mockSettingsApi } from './settings-mock-api'
import { settingsApi } from './settings-api'

export const settingsService = USE_MOCK_AUTH ? mockSettingsApi : settingsApi
