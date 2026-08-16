import type { ComponentPropsWithRef, ReactNode } from 'react'

type CheckboxFieldProps = Omit<ComponentPropsWithRef<'input'>, 'type' | 'className'> & {
  label: ReactNode
}

export function CheckboxField({ label, ...inputProps }: CheckboxFieldProps) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-line text-accent focus:ring-2 focus:ring-accent/40"
        {...inputProps}
      />
      {label}
    </label>
  )
}
