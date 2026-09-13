import { useState } from 'react'
import { UnderlineTabs } from '../../../components/ui/underline-tabs'
import { CompanyDocumentsView } from '../components/documents/company-documents-view'
import { DocumentTemplatesView } from '../components/documents/document-templates-view'
import { EmployeeDocumentsView } from '../components/documents/employee-documents-view'
import { UploadDocumentView } from '../components/documents/upload-document-view'
import { PeopleLoadError } from '../components/people-load-error'
import { useCompanyDocuments } from '../hooks/use-company-documents'
import { useDocumentTemplates } from '../hooks/use-document-templates'
import { useEmployeeDocuments } from '../hooks/use-employee-documents'
import { useEmployees } from '../hooks/use-employees'

type DocumentsTabKey = 'company' | 'employee' | 'templates' | 'upload'

const DOCUMENTS_TABS: { key: DocumentsTabKey; label: string }[] = [
  { key: 'company', label: 'Company Documents' },
  { key: 'employee', label: 'Employee Documents' },
  { key: 'templates', label: 'Document Templates' },
  { key: 'upload', label: 'Upload Document' },
]

export function DocumentsPage() {
  const [activeTab, setActiveTab] = useState<DocumentsTabKey>('company')
  const companyQuery = useCompanyDocuments()
  const employeeQuery = useEmployeeDocuments()
  const templateQuery = useDocumentTemplates()
  const employeesQuery = useEmployees()
  const { data: companyDocs, isPending: companyPending } = companyQuery
  const { data: employeeDocs, isPending: employeePending } = employeeQuery
  const { data: templates, isPending: templatesPending } = templateQuery
  const { data: employees } = employeesQuery

  const pendingByTab: Record<DocumentsTabKey, boolean> = {
    company: companyPending,
    employee: employeePending,
    templates: templatesPending,
    upload: false,
  }
  const hasError =
    (activeTab === 'company' ? companyQuery.isError : false) ||
    (activeTab === 'employee' ? employeeQuery.isError : false) ||
    (activeTab === 'templates' ? templateQuery.isError : false) ||
    (activeTab === 'upload' ? employeesQuery.isError : false)

  function retryActiveTab() {
    if (activeTab === 'company') void companyQuery.refetch()
    if (activeTab === 'employee') void employeeQuery.refetch()
    if (activeTab === 'templates') void templateQuery.refetch()
    if (activeTab === 'upload') void employeesQuery.refetch()
  }

  return (
    <div className="max-w-[1400px] space-y-5">
      <div>
        <h1 className="text-xl font-medium text-ink">Documents</h1>
        <p className="mt-1 text-sm text-muted">Company policies, employee files, and reusable templates.</p>
      </div>

      <UnderlineTabs tabs={DOCUMENTS_TABS} active={activeTab} onChange={setActiveTab} />

      {hasError ? (
        <PeopleLoadError resource="documents" onRetry={retryActiveTab} />
      ) : pendingByTab[activeTab] ? (
        <div className="h-64 animate-pulse rounded-panel border border-line bg-surface" />
      ) : (
        <>
          {activeTab === 'company' ? <CompanyDocumentsView documents={companyDocs ?? []} /> : null}
          {activeTab === 'employee' ? <EmployeeDocumentsView documents={employeeDocs ?? []} /> : null}
          {activeTab === 'templates' ? <DocumentTemplatesView templates={templates ?? []} /> : null}
          {activeTab === 'upload' ? <UploadDocumentView employees={employees ?? []} /> : null}
        </>
      )}
    </div>
  )
}
