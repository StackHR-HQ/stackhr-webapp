export function FormErrorBanner({ message }: { message: string }) {
  return (
    <div role="alert" className="mb-4 rounded-lg border border-critical/30 bg-critical/10 p-3 text-sm text-critical">
      {message}
    </div>
  )
}
