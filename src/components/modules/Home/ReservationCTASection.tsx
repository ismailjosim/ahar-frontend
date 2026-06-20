"use client"

import { useState } from "react"
import { Calendar, Users, Clock, Utensils, CheckCircle2 } from "lucide-react"

export default function ReservationCTASection() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    guests: "2 Persons",
    date: "",
    time: "07:30 PM (Dinner)",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate API integration for production
    setIsSubmitted(true)
  }

  return (
    <section className="motion-reveal py-24 bg-background relative overflow-hidden border-t border-border/40">
      {/* Background Premium Aesthetic Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-soft/30 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-warning-soft/30 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto">
        <div className="bg-card border border-border rounded-2xl p-8 md:p-14 shadow-xl shadow-foreground/5 relative overflow-hidden">
          {/* Subtle Decorative Golden Corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full pointer-events-none" />

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Header */}
              <div className="text-center max-w-2xl mx-auto">
                <span className="text-accent font-semibold tracking-widest uppercase text-xs sm:text-sm block mb-3 font-mono">
                  ✦ Premium Fine Dining ✦
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-card-foreground font-bengali tracking-tight">
                  Reserve Your Golden Table
                </h2>
                <p className="text-muted-foreground mt-3 text-sm sm:text-base">
                  Secure your spot at Ahar Bengal for an unforgettable heritage culinary experience. For private events,
                  please call us directly.
                </p>
              </div>

              {/* Grid Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Guest Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-accent" /> Number of Guests
                  </label>
                  <div className="relative">
                    <select
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                      className="w-full bg-muted/60 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent appearance-none transition-all"
                    >
                      <option>1 Person</option>
                      <option>2 Persons</option>
                      <option>4 Persons</option>
                      <option>6 Persons</option>
                      <option>8+ Persons (Private Hall)</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-muted-foreground text-xs">
                      ▼
                    </div>
                  </div>
                </div>

                {/* Date Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-accent" /> Preferred Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-muted/60 border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
                  />
                </div>

                {/* Time Slot Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-accent" /> Available Slots
                  </label>
                  <div className="relative">
                    <select
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full bg-muted/60 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent appearance-none transition-all"
                    >
                      <option disabled className="text-accent font-semibold">
                        -- Lunch Slots --
                      </option>
                      <option>12:30 PM (Lunch)</option>
                      <option>02:00 PM (Lunch)</option>
                      <option>03:30 PM (Lunch)</option>
                      <option disabled className="text-accent font-semibold">
                        -- Dinner Slots --
                      </option>
                      <option>07:00 PM (Dinner)</option>
                      <option>08:30 PM (Dinner)</option>
                      <option>10:00 PM (Dinner)</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-muted-foreground text-xs">
                      ▼
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Note */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Utensils className="w-3.5 h-3.5 text-accent" /> Special Requests (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Birthday celebration, allergic to nuts, high-chair for kids..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-muted/60 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all text-sm"
                />
              </div>

              {/* CTA Action Button */}
              <div className="pt-2 text-center">
                <button
                  type="submit"
                  className="motion-scale-hover min-w-55 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20 cursor-pointer"
                >
                  Confirm Table Reservation
                </button>
                <p className="text-xs text-muted-foreground mt-3">Instant confirmation. No booking fees required.</p>
              </div>
            </form>
          ) : (
            /* Success State after booking (Production Level Experience) */
            <div className="text-center py-8 space-y-6 animate-pulse-once">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success-soft text-success mb-2">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground font-bengali">
                  Reservation Requested Successfully!
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto text-sm">
                  We have received your request for{" "}
                  <span className="text-foreground font-semibold">{formData.guests}</span> on{" "}
                  <span className="text-foreground font-semibold">{formData.date || "selected date"}</span> at{" "}
                  <span className="text-foreground font-semibold">{formData.time}</span>.
                </p>
              </div>
              <div className="p-4 bg-secondary rounded-lg inline-block border border-border/60 text-xs text-muted-foreground max-w-sm">
                A confirmation SMS & Email with your digital gate-pass token has been sent.
              </div>
              <div>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs font-semibold text-primary hover:text-primary-hover underline underline-offset-4 cursor-pointer"
                >
                  Book another table
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
