const MenuHeader = () => {
  return (
    <section className="container mx-auto motion-reveal motion-shimmer relative mb-10 overflow-hidden rounded-3xl border border-accent/40 bg-linear-to-r from-primary via-primary-hover to-primary p-6 text-white shadow-xl sm:p-10">
      <div className="absolute bottom-0 right-0 translate-x-10 translate-y-10 text-[180px] opacity-10 sm:text-[220px]">
        🍲
      </div>
      <div className="relative z-10 max-w-xl space-y-4">
        <span className="inline-flex rounded-full border border-white/20 bg-accent px-3 py-1 text-xs font-black uppercase tracking-widest text-foreground">
          শাহী স্বাদ ও ঐতিহ্য
        </span>
        <h1 className="font-bengali text-3xl font-extrabold leading-tight sm:text-4xl">
          আহার মেনু তালিকা (Traditional Menu List)
        </h1>
        <p className="text-sm leading-relaxed text-white/80">
          Explore authentic slow-cooked Kacchi Biryanis, sizzling Kebabs, royal desserts, and cooling traditional
          drinks. Freshly prepared to deliver royalty directly to your table.
        </p>
      </div>
    </section>
  )
}

export default MenuHeader
