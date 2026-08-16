import type { ComponentPropsWithRef } from 'react'
import { TrailingDots } from './trailing-dots'

type ButtonVariant = 'primary' | 'secondary'

type ButtonProps = ComponentPropsWithRef<'button'> & {
  variant?: ButtonVariant
  loading?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-accent-ink hover:opacity-90',
  secondary: 'border border-line text-ink hover:bg-canvas',
}

export function Button({ variant = 'primary', loading = false, className, disabled, children, ...props }: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      aria-busy={loading}
      className={`relative flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-opacity disabled:opacity-50 ${variantClasses[variant]} ${className ?? ''}`}
      {...props}
    >
      <span className={loading ? 'invisible' : undefined}>{children}</span>
      {loading ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <TrailingDots size="sm" tone={variant === 'primary' ? 'inverted' : 'default'} />
        </span>
      ) : null}
    </button>
  )
}
