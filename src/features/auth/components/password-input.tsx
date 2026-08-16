import { useId, useState, type ComponentPropsWithRef } from 'react'

type PasswordInputProps = Omit<ComponentPropsWithRef<'input'>, 'type'> & {
  error?: string
}

export function PasswordInput({ error, className, id, ...inputProps }: PasswordInputProps) {
  const [visible, setVisible] = useState(false)
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div>
      <div className="relative">
        <input
          id={inputId}
          type={visible ? 'text' : 'password'}
          aria-invalid={Boolean(error)}
          className={`w-full rounded-lg border bg-canvas px-3 py-2 pr-10 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 ${
            error ? 'border-critical' : 'border-line focus:border-accent'
          } ${className ?? ''}`}
          {...inputProps}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded-r-lg"
        >
          {visible ? (
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M3 3l18 18" strokeLinecap="round" />
              <path
                d="M10.58 10.58a2 2 0 0 0 2.83 2.83M9.36 5.3A9.9 9.9 0 0 1 12 5c5 0 9 4 10 7a11.6 11.6 0 0 1-3.06 4.24M6.6 6.6C4.4 8 2.9 10.1 2 12c.7 1.5 2 3.4 3.9 4.9A9.9 9.9 0 0 0 12 19c1.05 0 2.06-.16 3-.46"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path
                d="M2 12c1-3 5-7 10-7s9 4 10 7c-1 3-5 7-10 7s-9-4-10-7Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
      {error ? (
        <p className="mt-1.5 text-sm text-critical" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
