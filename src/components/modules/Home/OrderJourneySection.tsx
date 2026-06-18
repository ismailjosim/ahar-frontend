import { orderSteps } from "@/lib/home.constant"

const toneClassName = {
  gold: "border-accent/40 bg-accent/15 text-accent",
  red: "border-primary/40 bg-primary/15 text-primary",
  green: "border-success/40 bg-success/15 text-success",
}

const OrderJourneySection = () => {
  return (
    <section className="border-t border-border/30 bg-muted/20 py-12">
      <div className="mx-auto max-w-7xl space-y-12 px-4 text-center sm:px-6 lg:px-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-accent">Order Journey</span>
          <h2 className="font-bengali mt-2 text-3xl font-black text-foreground">
            সহজ ৩ ধাপে অর্ডার করুন (How It Works)
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {orderSteps.map((step, index) => (
            <article
              key={step.title}
              className="rounded-2xl border border-border bg-white p-8 shadow-md transition hover:shadow-lg"
            >
              <div
                className={`mx-auto mb-4 flex size-16 items-center justify-center rounded-full border text-2xl font-bold ${
                  toneClassName[step.tone]
                }`}
              >
                {index + 1}
              </div>
              <h3 className="mt-2 text-xl font-black">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default OrderJourneySection
