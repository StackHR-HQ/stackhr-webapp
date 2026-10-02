import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentPropsWithRef } from 'react'
import { cn } from '../../lib/cn'
import { TrailingDots } from './trailing-dots'

const buttonVariants = cva(
  'relative flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-opacity disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-accent text-accent-ink hover:opacity-90',
        secondary: 'border border-line text-ink hover:bg-canvas',
      },
      width: {
        full: 'w-full',
        fit: 'w-fit',
        responsive: 'w-full md:w-fit',
      },
    },
    defaultVariants: { variant: 'primary', width: 'full' },
  },
)

type ButtonProps = ComponentPropsWithRef<'button'> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean
  }

export function Button({ variant, width, loading = false, className, disabled, children, ...props }: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn(buttonVariants({ variant, width }), className)}
      {...props}
    >
      <span className={loading ? 'invisible' : undefined}>{children}</span>
      {loading ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <TrailingDots size="sm" tone={variant === 'secondary' ? 'default' : 'inverted'} />
        </span>
      ) : null}
    </button>
  )
}
