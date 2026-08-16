import Papa from 'papaparse'

export interface CsvRowDraft {
  key: string
  fullName: string
  email: string
  department: string
  jobTitle: string
  employmentType: string
  salary: string
  startDate: string
  managerName: string
}

const REQUIRED_FIELDS: Array<keyof Omit<CsvRowDraft, 'key' | 'managerName'>> = [
  'fullName',
  'email',
  'department',
  'jobTitle',
  'employmentType',
  'salary',
  'startDate',
]

const HEADER_ALIASES: Record<string, keyof CsvRowDraft> = {
  fullname: 'fullName',
  'full name': 'fullName',
  name: 'fullName',
  email: 'email',
  'email address': 'email',
  department: 'department',
  dept: 'department',
  jobtitle: 'jobTitle',
  'job title': 'jobTitle',
  role: 'jobTitle',
  title: 'jobTitle',
  employmenttype: 'employmentType',
  'employment type': 'employmentType',
  type: 'employmentType',
  salary: 'salary',
  'monthly salary': 'salary',
  startdate: 'startDate',
  'start date': 'startDate',
  manager: 'managerName',
  'manager name': 'managerName',
}

function normalizeHeader(header: string): keyof CsvRowDraft | null {
  return HEADER_ALIASES[header.trim().toLowerCase()] ?? null
}

export interface ParsedEmployeeCsv {
  rows: CsvRowDraft[]
  missingColumns: string[]
}

export function parseEmployeeCsv(text: string): ParsedEmployeeCsv {
  const { data } = Papa.parse<Record<string, string>>(text.trim(), {
    header: true,
    skipEmptyLines: true,
  })

  const headerMap = new Map<string, keyof CsvRowDraft>()
  if (data.length > 0) {
    for (const rawHeader of Object.keys(data[0] as Record<string, string>)) {
      const normalized = normalizeHeader(rawHeader)
      if (normalized) headerMap.set(rawHeader, normalized)
    }
  }

  const foundFields = new Set(headerMap.values())
  const missingColumns = REQUIRED_FIELDS.filter((field) => !foundFields.has(field))

  const rows: CsvRowDraft[] = data.map((rawRow, index) => {
    const row: CsvRowDraft = {
      key: `csv-${index}`,
      fullName: '',
      email: '',
      department: '',
      jobTitle: '',
      employmentType: '',
      salary: '',
      startDate: '',
      managerName: '',
    }
    for (const [rawHeader, value] of Object.entries(rawRow)) {
      const field = headerMap.get(rawHeader)
      if (field) row[field] = (value ?? '').trim()
    }
    return row
  })

  return { rows, missingColumns }
}
