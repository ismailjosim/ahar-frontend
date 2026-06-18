import { Star } from "lucide-react"

import { guestReviews } from "@/lib/home.constant"

const ReviewsSection = () => {
  return (
    <section className="motion-reveal mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-accent">Guest Feedback</span>
        <h2 className="font-bengali mt-2 text-3xl font-black text-foreground">গ্রাহকদের মূল্যবান মতামত (Reviews)</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {guestReviews.map((review) => (
          <article
            key={review.name}
            className="motion-soft-hover rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="mb-3 flex items-center gap-1 text-accent">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="size-4 fill-current" />
              ))}
            </div>
            <p className="mb-4 text-sm italic leading-6 text-muted-foreground">&quot;{review.text}&quot;</p>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-accent/20 font-bold text-accent">
                {review.initials}
              </div>
              <div>
                <h3 className="text-sm font-bold">{review.name}</h3>
                <p className="text-xs text-muted-foreground">{review.role}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ReviewsSection
