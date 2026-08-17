type AvatarSize = 'sm' | 'md' | 'lg'

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
}

export function Avatar({ initials, size = 'md', className }: { initials: string; size?: AvatarSize; className?: string }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-surface-2 font-medium text-ink ${sizeClasses[size]} ${className ?? ''}`}
    >
      {initials}
    </span>
  )
}
