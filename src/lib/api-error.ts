// dev's UI components (Teams, Departments, leave, document upload) import this
// path. Re-export our http.ts helper so everyone gets its 429 handling and
// 5xx internals hidden from the UI, instead of maintaining two copies.
export { getApiErrorMessage } from './http'
