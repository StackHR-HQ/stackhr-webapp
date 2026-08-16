function Block({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-panel border border-line bg-surface ${className}`} />
}

export function DashboardSkeleton() {
  return (
    <div className="max-w-[1400px] space-y-6">
      <div className="h-16 animate-pulse rounded-panel border border-line bg-surface" />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Block key={index} className="h-24" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Block className="h-48" />
          <Block className="h-80" />
          <Block className="h-64" />
        </div>
        <div className="space-y-6">
          <Block className="h-56" />
          <Block className="h-48" />
          <Block className="h-40" />
        </div>
      </div>
    </div>
  )
}
