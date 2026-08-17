import { FileTextIcon } from '@phosphor-icons/react'
import { Card } from '../../../../components/ui/card'
import type { DocumentTemplate } from '../../types/people-types'

export function DocumentTemplatesView({ templates }: { templates: DocumentTemplate[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <Card key={template.id}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-2">
            <FileTextIcon className="h-4 w-4 text-ink" />
          </div>
          <p className="mt-3 text-sm font-medium text-ink">{template.name}</p>
          <p className="text-xs text-muted">{template.category}</p>
          <p className="mt-2 text-xs text-muted">{template.description}</p>
        </Card>
      ))}
    </div>
  )
}
