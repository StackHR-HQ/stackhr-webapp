function Block({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-panel border border-line bg-surface ${className}`} />
}

export function DashboardSkeleton() {
  return (
    <div className="max-w-[1400px] space-y-6">
      <Block className="h-16" />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Block key={index} className="h-24" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Block className="h-36" />
          <Block className="h-64" />
        </div>
        <div className="space-y-6">
          <Block className="h-56" />
        </div>
      </div>
    </div>
  )
}
