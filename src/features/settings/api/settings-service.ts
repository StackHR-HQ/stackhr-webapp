import { USE_MOCK_SETTINGS } from '../../../lib/env'
import { mockSettingsApi } from './settings-mock-api'
import { settingsApi } from './settings-api'

export const settingsService = USE_MOCK_SETTINGS ? mockSettingsApi : settingsApi
