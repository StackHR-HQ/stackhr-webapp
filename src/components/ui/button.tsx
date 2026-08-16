import type { ComponentPropsWithRef } from 'react'

type ButtonVariant = 'primary' | 'secondary'

type ButtonProps = ComponentPropsWithRef<'button'> & {
  variant?: ButtonVariant
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-accent-ink hover:opacity-90',
  secondary: 'border border-line text-ink hover:bg-canvas',
}

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button
      className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-opacity disabled:opacity-50 ${variantClasses[variant]} ${className ?? ''}`}
      {...props}
    />
  )
}
