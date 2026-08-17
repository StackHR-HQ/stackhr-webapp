import type { ReactNode } from 'react'

export function FieldGrid({ fields }: { fields: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
      {fields.map((field) => (
        <div key={field.label}>
          <dt className="text-xs text-muted">{field.label}</dt>
          <dd className="mt-0.5 text-sm font-medium text-ink">{field.value}</dd>
        </div>
      ))}
    </dl>
  )
}
