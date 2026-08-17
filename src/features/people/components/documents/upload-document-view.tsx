import { CloudArrowUpIcon, FileTextIcon } from '@phosphor-icons/react'
import { useRef, useState, type DragEvent } from 'react'
import { Button } from '../../../../components/ui/button'
import { Card, CardHeader } from '../../../../components/ui/card'
import { SelectField } from '../../../../components/ui/select-field'
import { TextField } from '../../../../components/ui/text-field'
import { formatDate, formatFileSize } from '../../lib/format'
import type { EmployeeSummary } from '../../types/people-types'

const CATEGORY_OPTIONS = ['Policy', 'Contract', 'Identification', 'Compliance', 'Compensation', 'Other'].map(
  (value) => ({ value, label: value }),
)

interface UploadedDocument {
  id: string
  name: string
  category: string
  fileSize: string
  uploadedAt: string
  assignToLabel: string
}

export function UploadDocumentView({ employees }: { employees: EmployeeSummary[] }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [documentName, setDocumentName] = useState('')
  const [category, setCategory] = useState('Policy')
  const [assignTo, setAssignTo] = useState('company')
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>([])

  const assignToOptions = [
    { value: 'company', label: 'Company-wide' },
    ...employees.map((employee) => ({ value: employee.id, label: employee.fullName })),
  ]

  function selectFile(file: File) {
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

    const assignToLabel = assignToOptions.find((option) => option.value === assignTo)?.label ?? 'Company-wide'
    setUploadedDocs((prev) => [
      {
        id: `${Date.now()}-${prev.length}`,
        name: documentName.trim(),
        category,
        fileSize: formatFileSize(selectedFile.size),
        uploadedAt: new Date().toISOString(),
        assignToLabel,
      },
      ...prev,
    ])
    setSelectedFile(null)
    setDocumentName('')
    if (fileInputRef.current) fileInputRef.current.value = ''
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

          <Button type="button" onClick={handleSubmit} disabled={!selectedFile || !documentName.trim()}>
            Add document
          </Button>
        </div>
      </Card>

      <Card>
        <CardHeader title="Added this session" description="Uploads are kept locally for this demo and aren't persisted" />
        {uploadedDocs.length > 0 ? (
          <ul className="divide-y divide-line">
            {uploadedDocs.map((document) => (
              <li key={document.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-2">
                  <FileTextIcon className="h-4 w-4 text-ink" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{document.name}</p>
                  <p className="text-xs text-muted">
                    {document.category} · {document.assignToLabel} · {formatDate(document.uploadedAt)} ·{' '}
                    {document.fileSize}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">Nothing added yet.</p>
        )}
      </Card>
    </div>
  )
}
