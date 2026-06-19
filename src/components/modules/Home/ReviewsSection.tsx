import { Star } from "lucide-react"

// shadcn ui components
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import { guestReviews } from "@/lib/home.constant"

const ReviewsSection = () => {
  return (
    <section className="mx-auto py-16 container">
      {/* Section Header */}
      <div className="mb-12 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-accent">Guest Feedback</span>
        <h2 className="font-bengali mt-2 text-3xl font-black text-foreground">গ্রাহকদের মূল্যবান মতামত (Reviews)</h2>
      </div>

      {/* Reviews Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {guestReviews.map((review) => (
          <article
            key={review.name}
            className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            {/* Star Rating Icons */}
            <div className="mb-4 flex items-center gap-0.5 text-accent">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className="size-4 fill-current transition-transform duration-300 group-hover:scale-110"
                />
              ))}
            </div>

            {/* Review Blockquote Text */}
            <blockquote className="mb-6 text-sm italic leading-relaxed text-muted-foreground">
              &ldquo;{review.text}&rdquo;
            </blockquote>

            {/* Reviewer Metadata */}
            <div className="flex items-center gap-3">
              <Avatar className="size-10 border border-accent/20">
                <AvatarFallback className="bg-accent/10 font-bold text-accent text-sm">
                  {review.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-sm font-bold text-foreground tracking-tight">{review.name}</h3>
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
