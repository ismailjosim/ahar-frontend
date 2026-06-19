import { orderSteps } from "@/lib/home.constant"

// Safely type mapping configuration keys
type StepTone = "gold" | "red" | "green"

const toneClassName: Record<StepTone, string> = {
  gold: "border-accent/40 bg-accent/15 text-accent",
  red: "border-primary/40 bg-primary/15 text-primary",
  green: "border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
}

const OrderJourneySection = () => {
  return (
    <section className="border-t border-border/30 bg-muted/20 py-12">
      <div className="mx-auto container space-y-12 text-center">
        {/* Section Heading */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-accent">Order Journey</span>
          <h2 className="font-bengali mt-2 text-3xl font-black text-foreground">
            সহজ ৩ ধাপে অর্ডার করুন (How It Works)
          </h2>
        </div>

        {/* Steps Cards Layout Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {orderSteps.map((step, index) => (
            <article
              key={step.title}
              className="group rounded-2xl border border-border bg-card p-8 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Ordered Number Indicator Bubble */}
              <div
                className={`mx-auto mb-6 flex size-16 items-center justify-center rounded-full border text-2xl font-black transition-transform duration-300 group-hover:scale-110 ${
                  toneClassName[step.tone as StepTone] || toneClassName.gold
                }`}
              >
                {index + 1}
              </div>

              <h3 className="mt-2 text-xl font-black text-foreground tracking-tight">{step.title}</h3>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default OrderJourneySection
