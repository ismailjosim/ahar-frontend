const PublicFooter = () => {
  return (
    <footer className="bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <p className="text-xl font-black text-primary">আহার (Ahar)</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Premium Bengali dining website and restaurant management platform.
          </p>
        </div>
        <p className="text-sm font-semibold text-muted-foreground">2026 Ahar Restaurant Systems</p>
      </div>
    </footer>
  )
}

export default PublicFooter
