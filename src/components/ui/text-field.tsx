import { useId, type ComponentPropsWithRef, type ReactNode } from 'react'

type TextFieldProps = Omit<ComponentPropsWithRef<'input'>, 'className'> & {
  label: ReactNode
  error?: string
  inputClassName?: string
}

export function TextField({ label, error, id, inputClassName, ...inputProps }: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-lg border bg-canvas px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 ${
          error ? 'border-critical' : 'border-line focus:border-accent'
        } ${inputClassName ?? ''}`}
        {...inputProps}
      />
      {error ? (
        <p className="mt-1.5 text-sm text-critical" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
