import type { TaxRuleSet, TaxRuleSetId } from '../types/payroll-types'

export const TAX_RULE_SETS: Record<TaxRuleSetId, TaxRuleSet> = {
  'NG-2026-v1': {
    id: 'NG-2026-v1',
    version: 'v1.0',
    effectiveFrom: '2026-01-01',
    label: 'Nigeria — NG-2026-v1',
    description:
      'Based on the Nigeria Tax Act 2025, effective January 1, 2026. Consolidated Relief Allowance abolished in favor of a simplified progressive band structure with a rent relief provision and a raised minimum-wage exemption threshold.',
  },
  'NG-2025': {
    id: 'NG-2025',
    version: 'v3.2',
    effectiveFrom: '2011-01-01',
    label: 'Nigeria — NG-2025 (legacy)',
    description:
      'Retained for historical and pre-2026 payroll periods. Uses the Consolidated Relief Allowance (CRA) and the graduated bands from the Personal Income Tax Act (as amended).',
  },
}

interface TaxBand {
  limit: number
  rate: number
}

// NG-2026-v1: simplified progressive bands on gross annual income, no CRA.
const NG_2026_BANDS: TaxBand[] = [
  { limit: 800_000, rate: 0 },
  { limit: 3_000_000, rate: 0.15 },
  { limit: 12_000_000, rate: 0.18 },
  { limit: 25_000_000, rate: 0.21 },
  { limit: 50_000_000, rate: 0.23 },
  { limit: Infinity, rate: 0.25 },
]

// NG-2025 (legacy): graduated bands applied to taxable income after CRA and
// pension relief.
const NG_2025_BANDS: TaxBand[] = [
  { limit: 300_000, rate: 0.07 },
  { limit: 600_000, rate: 0.11 },
  { limit: 1_100_000, rate: 0.15 },
  { limit: 1_600_000, rate: 0.19 },
  { limit: 3_200_000, rate: 0.21 },
  { limit: Infinity, rate: 0.24 },
]

function progressiveTax(taxableAmount: number, bands: TaxBand[]): number {
  let remaining = Math.max(0, taxableAmount)
  let previousLimit = 0
  let tax = 0

  for (const band of bands) {
    if (remaining <= 0) break
    const bandSize = band.limit - previousLimit
    const amountInBand = Math.min(remaining, bandSize)
    tax += amountInBand * band.rate
    remaining -= amountInBand
    previousLimit = band.limit
  }

  return tax
}

// Simplified, illustrative calculation for this demo — not tax advice.
export function calculateAnnualPaye(ruleSetId: TaxRuleSetId, annualGross: number, annualPensionEmployee: number): number {
  if (ruleSetId === 'NG-2026-v1') {
    return progressiveTax(annualGross, NG_2026_BANDS)
  }

  const consolidatedReliefAllowance = Math.max(200_000 + annualGross * 0.2, annualGross * 0.01)
  const taxableIncome = annualGross - consolidatedReliefAllowance - annualPensionEmployee
  return progressiveTax(taxableIncome, NG_2025_BANDS)
}
