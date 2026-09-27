import { afterEach, describe, expect, test } from 'bun:test'
import type { InternalAxiosRequestConfig } from 'axios'
import { settingsApi } from '../src/features/settings/api/settings-api'
import { http } from '../src/lib/http'

const originalAdapter = http.defaults.adapter

const organization = {
  id: 'organization-uuid',
  name: 'Acme Nigeria Ltd.',
  slug: 'acme-nigeria',
  logo: 'https://cdn.example.com/company-logo.png',
  industry: 'Technology',
  companySize: '11-50',
  currency: 'NGN',
  payrollFrequency: 'MONTHLY',
  taxId: 'TIN 12345678-0001',
  createdAt: '2026-08-22T10:00:00.000Z',
  updatedAt: '2026-08-22T10:00:00.000Z',
}

afterEach(() => {
  http.defaults.adapter = originalAdapter
})

describe('organization settings API', () => {
  test('reads and maps the current organization endpoint', async () => {
    let request: InternalAxiosRequestConfig | undefined
    http.defaults.adapter = async (config) => {
      request = config
      return { data: organization, status: 200, statusText: 'OK', headers: {}, config }
    }

    const settings = await settingsApi.getOrganizationSettings()

    expect(request?.url).toBe('/organization/current')
    expect(settings.companyInformation).toEqual({
      name: 'Acme Nigeria Ltd.',
      industry: 'Technology',
      companySize: '11-50',
      currency: 'NGN',
      payrollFrequency: 'Monthly',
    })
    expect(settings.branding.logoDataUrl).toBe(organization.logo)
    expect(settings.businessInformation.taxId).toBe(organization.taxId)
  })

  test('sends only supported company fields to the onboarding endpoint', async () => {
    let request: InternalAxiosRequestConfig | undefined
    http.defaults.adapter = async (config) => {
      request = config
      return { data: { organization }, status: 200, statusText: 'OK', headers: {}, config }
    }

    await settingsApi.updateOrganizationSettings({
      companyInformation: {
        name: 'Acme Nigeria Ltd.',
        industry: 'Technology',
        companySize: '11-50',
        currency: 'NGN',
        payrollFrequency: 'MONTHLY',
      },
      address: { line1: '14 Admiralty Way', line2: '', city: 'Lagos', state: 'Lagos', country: 'Nigeria', postalCode: '' },
      businessInformation: { registrationNumber: 'RC 1234567', taxId: 'TIN 12345678-0001', businessType: '', website: '', foundedYear: '' },
    })

    expect(request?.url).toBe('/onboarding/company')
    expect(JSON.parse(request?.data as string)).toEqual({
      addressLine1: '14 Admiralty Way',
      addressLine2: null,
      businessType: null,
      city: 'Lagos',
      companyName: 'Acme Nigeria Ltd.',
      industry: 'Technology',
      companySize: '11-50',
      country: 'Nigeria',
      currency: 'NGN',
      foundedYear: null,
      postalCode: null,
      registrationNumber: 'RC 1234567',
      state: 'Lagos',
      taxId: 'TIN 12345678-0001',
      website: null,
      payrollFrequency: 'MONTHLY',
    })
  })
})
