import { useId, type ComponentPropsWithRef, type ReactNode } from 'react'

type SelectFieldProps = Omit<ComponentPropsWithRef<'select'>, 'className'> & {
  label: ReactNode
  error?: string
  placeholder?: string
  options: ReadonlyArray<{ value: string; label: string }>
}

export function SelectField({ label, error, id, placeholder, options, ...selectProps }: SelectFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      <select
        id={inputId}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-lg border bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 ${
          error ? 'border-critical' : 'border-line focus:border-accent'
        }`}
        {...selectProps}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p className="mt-1.5 text-sm text-critical" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
