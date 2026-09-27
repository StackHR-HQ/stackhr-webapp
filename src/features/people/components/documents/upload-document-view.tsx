import { CloudArrowUpIcon } from '@phosphor-icons/react'
import { useRef, useState, type DragEvent } from 'react'
import { Button } from '../../../../components/ui/button'
import { Card, CardHeader } from '../../../../components/ui/card'
import { SelectField } from '../../../../components/ui/select-field'
import { TextField } from '../../../../components/ui/text-field'
import { getApiErrorMessage } from '../../../../lib/api-error'
import { notify } from '../../../../lib/toast'
import { formatFileSize } from '../../lib/format'
import type { EmployeeSummary } from '../../types/people-types'
import { useUploadDocument } from '../../hooks/use-upload-document'

const CATEGORY_OPTIONS = ['Policy', 'Contract', 'Identification', 'Compliance', 'Compensation', 'Other'].map(
  (value) => ({ value, label: value }),
)

export function UploadDocumentView({ employees }: { employees: EmployeeSummary[] }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [documentName, setDocumentName] = useState('')
  const [category, setCategory] = useState('Policy')
  const [assignTo, setAssignTo] = useState('company')
  const uploadDocument = useUploadDocument()

  const assignToOptions = [
    { value: 'company', label: 'Company-wide' },
    ...employees.map((employee) => ({ value: employee.id, label: employee.fullName })),
  ]

  function selectFile(file: File) {
    if (file.size > 10_000_000) {
      notify.warning('File is too large', 'Choose a file smaller than 10 MB.')
      return
    }
    setSelectedFile(file)
    setDocumentName((current) => current || file.name.replace(/\.[^/.]+$/, ''))
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files[0]
    if (file) selectFile(file)
  }

  function handleSubmit() {
    if (!selectedFile || !documentName.trim()) return

    uploadDocument.mutate(
      {
        file: selectedFile,
        name: documentName.trim(),
        category,
        scope: assignTo === 'company' ? 'company' : 'employee',
        employeeId: assignTo === 'company' ? undefined : assignTo,
      },
      {
        onSuccess: () => {
          notify.success('Document uploaded')
          setSelectedFile(null)
          setDocumentName('')
          if (fileInputRef.current) fileInputRef.current.value = ''
        },
        onError: (error) => notify.error('Could not upload document', getApiErrorMessage(error, 'Please try again.')),
      },
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <Card>
        <CardHeader title="Upload a document" />

        <div
          onDragOver={(event) => {
            event.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed p-6 text-center transition-colors ${
            isDragging ? 'border-accent bg-accent/5' : 'border-line hover:bg-canvas'
          }`}
        >
          <CloudArrowUpIcon className="h-6 w-6 text-muted" />
          {selectedFile ? (
            <p className="text-sm text-ink">
              {selectedFile.name} <span className="text-muted">({formatFileSize(selectedFile.size)})</span>
            </p>
          ) : (
            <>
              <p className="text-sm text-ink">Drag and drop a file, or click to browse</p>
              <p className="text-xs text-muted">PDF, DOCX, JPG, or PNG up to 10 MB</p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.jpg,.jpeg,.png,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) selectFile(file)
            }}
          />
        </div>

        <div className="mt-4 space-y-4">
          <TextField
            label="Document name"
            value={documentName}
            onChange={(event) => setDocumentName(event.target.value)}
            placeholder="e.g. Signed employment contract"
          />
          <SelectField
            label="Category"
            options={CATEGORY_OPTIONS}
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          />
          <SelectField
            label="Assign to"
            options={assignToOptions}
            value={assignTo}
            onChange={(event) => setAssignTo(event.target.value)}
          />

          <Button type="button" onClick={handleSubmit} loading={uploadDocument.isPending} disabled={!selectedFile || !documentName.trim()}>
            Upload document
          </Button>
        </div>
      </Card>

      <Card>
        <CardHeader title="Upload status" description="Successful uploads are saved securely and appear in the relevant document list." />
        <p className="text-sm text-muted">Choose whether the document is company-wide or assigned to a specific employee.</p>
      </Card>
    </div>
  )
}
