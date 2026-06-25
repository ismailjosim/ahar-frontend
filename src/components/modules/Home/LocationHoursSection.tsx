"use client"

import { MapPin, Phone, Mail, Clock, Compass, ExternalLink } from "lucide-react"
import { usePublicSettings } from "@/lib/use-public-settings"

export default function LocationHoursSection() {
  const settings = usePublicSettings()
  const openingTime = settings?.openingTime ?? "11:00"
  const closingTime = settings?.closingTime ?? "23:00"
  const address = settings?.address ?? "Gulshan Avenue, Dhaka"
  const supportPhone = settings?.supportPhone ?? "+880 17XXXXXXXX"

  // Format 24h time (e.g. "11:00") to 12h display (e.g. "11:00 AM")
  function formatTime(time: string) {
    const [hourStr, min] = time.split(":")
    const hour = parseInt(hourStr, 10)
    const period = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 === 0 ? 12 : hour % 12
    return `${displayHour}:${min} ${period}`
  }
  return (
    <section className="motion-reveal py-20 bg-muted/30 border-t border-border/80 relative">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          {/* Left Column: Branch Info & Timings (Takes 5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            {/* Header Text */}
            <div>
              <span className="text-accent font-semibold tracking-wider uppercase text-xs block mb-2 font-mono">
                ✦ Find Us ✦
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3 font-bengali tracking-tight">
                Visit Ahar Bengal
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Experience heritage dining in the heart of Dhaka. Stop by or get directions instantly.
              </p>
            </div>

            {/* Address & Contact Cards */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border/60 shadow-xs">
                <div className="p-3 rounded-lg bg-primary-soft text-primary shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-card-foreground text-base">Branch Location</h4>
                  <p className="text-sm text-muted-foreground mt-0.5">{address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border/60 shadow-xs">
                <div className="p-3 rounded-lg bg-primary-soft text-primary shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-card-foreground text-base">Hotline & Bookings</h4>
                  <p className="text-sm text-muted-foreground mt-0.5">+880 {supportPhone}</p>
                </div>
              </div>
            </div>

            {/* Premium Opening Hours Box */}
            <div className="p-6 bg-secondary border border-border rounded-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-bl-full pointer-events-none" />

              <h4 className="font-bold text-foreground flex items-center gap-2 mb-4 text-base">
                <Clock className="w-4 h-4 text-accent animate-float" /> Opening Hours
              </h4>

              <div className="grid grid-cols-2 gap-6 divide-x divide-border/80">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Opening</p>
                  <p className="text-foreground font-semibold text-sm sm:text-base">{formatTime(openingTime)}</p>
                </div>
                <div className="space-y-1 pl-6">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Closing</p>
                  <p className="text-foreground font-semibold text-sm sm:text-base">{formatTime(closingTime)}</p>
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground mt-4 italic">
                * Kitchen closes 30 minutes before the session ends. Open all days a week.
              </p>
            </div>
          </div>

          {/* Right Column: Google Maps (Takes 7 cols) */}
          <div className="lg:col-span-7 min-h-95 lg:min-h-full rounded-2xl overflow-hidden border border-border bg-card relative shadow-md group">
            {/* Live Interactive Map Embedding */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14602.254191386186!2d90.412497!3d23.777176!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7a15a6b0c2f%3A0x67303f8fcd4522!2sGulshan%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1690000000000!5m2!1sen!2sbd"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              // আপনার প্যালেট থিমের সাথে মানানসই করার জন্য কাস্টম ডার্ক এবং লাইট মোড ফিল্টার অ্যাডজাস্টমেন্ট
              className="absolute inset-0 w-full h-full grayscale-20 contrast-105 dark:invert-92 dark:hue-rotate-180 transition-all duration-300 group-hover:grayscale-0"
            />

            {/* Quick Map Action Floating Badge */}
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="motion-scale-hover absolute bottom-4 right-4 bg-card text-card-foreground border border-border text-xs font-semibold px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 hover:bg-muted transition-colors z-10"
            >
              <Compass className="w-3.5 h-3.5 text-primary" /> Open in Maps{" "}
              <ExternalLink className="w-3 h-3 text-muted-foreground" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
