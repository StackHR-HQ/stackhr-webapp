import { isoDaysAgo } from '../lib/dates'
import type { CompanyDocument, DocumentTemplate } from '../types/people-types'

export const COMPANY_DOCUMENTS: CompanyDocument[] = [
  {
    id: 'company-doc-handbook',
    name: 'Employee handbook',
    category: 'Policy',
    uploadedAt: isoDaysAgo(210),
    fileSize: '2.4 MB',
    visibility: 'All employees',
  },
  {
    id: 'company-doc-conduct',
    name: 'Code of conduct',
    category: 'Policy',
    uploadedAt: isoDaysAgo(210),
    fileSize: '540 KB',
    visibility: 'All employees',
  },
  {
    id: 'company-doc-leave-policy',
    name: 'Leave policy',
    category: 'Policy',
    uploadedAt: isoDaysAgo(150),
    fileSize: '312 KB',
    visibility: 'All employees',
  },
  {
    id: 'company-doc-expense-policy',
    name: 'Expense & reimbursement policy',
    category: 'Policy',
    uploadedAt: isoDaysAgo(150),
    fileSize: '298 KB',
    visibility: 'All employees',
  },
  {
    id: 'company-doc-security',
    name: 'IT & data security policy',
    category: 'Compliance',
    uploadedAt: isoDaysAgo(95),
    fileSize: '410 KB',
    visibility: 'All employees',
  },
  {
    id: 'company-doc-anti-harassment',
    name: 'Anti-harassment policy',
    category: 'Compliance',
    uploadedAt: isoDaysAgo(210),
    fileSize: '275 KB',
    visibility: 'All employees',
  },
  {
    id: 'company-doc-comp-framework',
    name: 'Compensation framework',
    category: 'Compensation',
    uploadedAt: isoDaysAgo(60),
    fileSize: '620 KB',
    visibility: 'Admins only',
  },
]

export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'template-offer-letter',
    name: 'Offer letter template',
    category: 'Hiring',
    description: 'Standard offer letter with role, compensation, and start date placeholders.',
  },
  {
    id: 'template-employment-contract',
    name: 'Employment contract template',
    category: 'Hiring',
    description: 'Full employment agreement covering terms, probation, and termination clauses.',
  },
  {
    id: 'template-nda',
    name: 'NDA & confidentiality template',
    category: 'Legal',
    description: 'Mutual non-disclosure agreement for new hires and contractors.',
  },
  {
    id: 'template-salary-advance',
    name: 'Salary advance agreement',
    category: 'Payroll',
    description: 'Repayment terms template used when an employee’s salary advance is approved.',
  },
  {
    id: 'template-exit-checklist',
    name: 'Exit & offboarding checklist',
    category: 'Offboarding',
    description: 'Checklist covering asset return, access revocation, and final pay for departing employees.',
  },
]
