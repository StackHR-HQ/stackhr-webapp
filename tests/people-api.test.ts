import { afterEach, describe, expect, test } from 'bun:test'
import type { InternalAxiosRequestConfig } from 'axios'
import { peopleApi } from '../src/features/people/api/people-api'
import { http } from '../src/lib/http'

const originalAdapter = http.defaults.adapter

function captureRequest() {
  let request: InternalAxiosRequestConfig | undefined
  http.defaults.adapter = async (config) => {
    request = config
    return { data: { employeeId: 'emp_1' }, status: 200, statusText: 'OK', headers: {}, config }
  }
  return () => request
}

afterEach(() => {
  http.defaults.adapter = originalAdapter
})

describe('People mutation API', () => {
  test('creates a department with its head and member assignments', async () => {
    const request = captureRequest()
    await peopleApi.createDepartment({
      name: 'Customer Success',
      headEmployeeId: 'emp_1',
      memberIds: ['emp_1', 'emp_2'],
    })

    expect(request()?.url).toBe('/people/departments')
    expect(request()?.method).toBe('post')
    expect(JSON.parse(request()?.data as string)).toEqual({
      name: 'Customer Success',
      headEmployeeId: 'emp_1',
      memberIds: ['emp_1', 'emp_2'],
    })
  })

  test('updates a department and its membership atomically', async () => {
    const request = captureRequest()
    await peopleApi.updateDepartment('dept_1', {
      name: 'Customer Success',
      headEmployeeId: 'emp_2',
      memberIds: ['emp_2', 'emp_3'],
    })

    expect(request()?.url).toBe('/people/departments/dept_1')
    expect(request()?.method).toBe('patch')
    expect(JSON.parse(request()?.data as string)).toEqual({
      name: 'Customer Success',
      headEmployeeId: 'emp_2',
      memberIds: ['emp_2', 'emp_3'],
    })
  })

  test('sends opt-in directory pagination and filters as query parameters', async () => {
    const request = captureRequest()
    await peopleApi.getEmployeeDirectory({ page: 2, pageSize: 25, search: ' ada ', employmentStatus: 'active' })

    expect(request()?.url).toBe('/people/employees')
    expect(request()?.method).toBe('get')
    expect(request()?.params).toEqual({ page: 2, pageSize: 25, search: 'ada', employmentStatus: 'active' })
  })

  test('sends a leave decision to its persisted endpoint', async () => {
    const request = captureRequest()
    await peopleApi.decideLeaveRequest('leave_1', 'approved')

    expect(request()?.url).toBe('/people/leave/requests/leave_1/decision')
    expect(request()?.method).toBe('patch')
    expect(JSON.parse(request()?.data as string)).toEqual({ status: 'approved' })
  })

  test('uploads documents as multipart form data', async () => {
    const request = captureRequest()
    const file = new File(['signed contract'], 'contract.pdf', { type: 'application/pdf' })
    await peopleApi.uploadDocument({
      file,
      name: 'Signed contract',
      category: 'Contract',
      scope: 'employee',
      employeeId: 'emp_1',
    })

    expect(request()?.url).toBe('/people/documents')
    expect(request()?.method).toBe('post')
    const body = request()?.data as FormData
    const uploadedFile = body.get('file') as File
    expect(uploadedFile.name).toBe('contract.pdf')
    expect(uploadedFile.type).toBe('application/pdf')
    expect(body.get('scope')).toBe('employee')
    expect(body.get('employeeId')).toBe('emp_1')
  })

  test('updates one onboarding checklist item without replacing the checklist', async () => {
    const request = captureRequest()
    await peopleApi.updateOnboardingChecklist('emp_1', 'item_1', true)

    expect(request()?.url).toBe('/people/onboarding/employees/emp_1/checklist/item_1')
    expect(request()?.method).toBe('patch')
    expect(JSON.parse(request()?.data as string)).toEqual({ completed: true })
  })
})
