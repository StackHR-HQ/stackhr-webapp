import type { EmployeeSeed } from '../../people/data/employees'
import { BASIC_PERCENT, HOUSING_PERCENT, TRANSPORT_PERCENT } from './earning-structure'
import { calculateAnnualPaye } from './tax-rules'
import type { PayrollRunSummary, RunEmployeeLine, StatutoryContributionRule, TaxRuleSetId } from '../types/payroll-types'

function contributionBaseAmount(base: StatutoryContributionRule['base'], gross: number, basic: number, bht: number): number {
  if (base === 'basic') return basic
  if (base === 'bht') return bht
  return gross
}

export function calculateRunLines(
  employees: EmployeeSeed[],
  ruleSetId: TaxRuleSetId,
  statutoryContributions: StatutoryContributionRule[],
): RunEmployeeLine[] {
  const pensionRule = statutoryContributions.find((rule) => rule.id === 'pension')!
  const nhfRule = statutoryContributions.find((rule) => rule.id === 'nhf')!
  const nhiaRule = statutoryContributions.find((rule) => rule.id === 'nhia')!
  const nsitfRule = statutoryContributions.find((rule) => rule.id === 'nsitf')!

  return employees.map((employee) => {
    const annualGross = employee.compensation.salary
    const grossPay = annualGross / 12
    const basic = grossPay * BASIC_PERCENT
    const housing = grossPay * HOUSING_PERCENT
    const transport = grossPay * TRANSPORT_PERCENT
    const otherAllowances = grossPay - basic - housing - transport
    const bht = basic + housing + transport

    const pensionBase = pensionRule.applicability === 'not_applicable' ? 0 : contributionBaseAmount(pensionRule.base, grossPay, basic, bht)
    const pensionEmployee = pensionBase * (pensionRule.employeeRatePercent / 100)
    const pensionEmployer = pensionBase * (pensionRule.employerRatePercent / 100)

    const nhfBase = nhfRule.applicability === 'not_applicable' ? 0 : contributionBaseAmount(nhfRule.base, grossPay, basic, bht)
    const nhfEmployee = nhfBase * (nhfRule.employeeRatePercent / 100)

    const nhiaBase = nhiaRule.applicability === 'not_applicable' ? 0 : contributionBaseAmount(nhiaRule.base, grossPay, basic, bht)
    const nhiaEmployer = nhiaBase * (nhiaRule.employerRatePercent / 100)

    const nsitfBase = nsitfRule.applicability === 'not_applicable' ? 0 : contributionBaseAmount(nsitfRule.base, grossPay, basic, bht)
    const nsitfEmployer = nsitfBase * (nsitfRule.employerRatePercent / 100)

    const annualPaye = calculateAnnualPaye(ruleSetId, annualGross, pensionEmployee * 12)
    const paye = annualPaye / 12

    const totalDeductions = paye + pensionEmployee + nhfEmployee
    const netPay = grossPay - totalDeductions
    const totalEmployerContributions = pensionEmployer + nhiaEmployer + nsitfEmployer
    const employerCost = grossPay + totalEmployerContributions

    return {
      employeeId: employee.id,
      employeeName: employee.fullName,
      avatarInitials: employee.avatarInitials,
      jobTitle: employee.jobTitle,
      basic,
      housing,
      transport,
      otherAllowances,
      grossPay,
      paye,
      pensionEmployee,
      nhfEmployee,
      totalDeductions,
      netPay,
      pensionEmployer,
      nhiaEmployer,
      nsitfEmployer,
      totalEmployerContributions,
      employerCost,
    }
  })
}

export function summarizeRun(lines: RunEmployeeLine[], currency: string): PayrollRunSummary {
  return {
    employeeCount: lines.length,
    currency,
    grossPay: lines.reduce((sum, line) => sum + line.grossPay, 0),
    totalEmployeeDeductions: lines.reduce((sum, line) => sum + line.totalDeductions, 0),
    totalEmployerContributions: lines.reduce((sum, line) => sum + line.totalEmployerContributions, 0),
    netPay: lines.reduce((sum, line) => sum + line.netPay, 0),
    totalEmployerCost: lines.reduce((sum, line) => sum + line.employerCost, 0),
  }
}
