export default function SignupFormSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-10 w-full animate-pulse rounded-md bg-muted" />
      ))}
      <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
    </div>
  )
}
