import Link from "next/link"

const PublicFooter = () => {
  return (
    <footer className="motion-reveal border-t border-border bg-secondary py-12">
      <div className="container mx-auto grid gap-8 md:grid-cols-[1.3fr_0.7fr_0.7fr_0.9fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl border border-accent bg-primary">
              <span className="font-bengali text-xl font-bold text-accent">আ</span>
            </div>
            <span className="font-bengali text-xl font-black text-primary">আহার</span>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">
            Premium Bengali dining website and restaurant management platform.
          </p>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary">Quick Links</h2>
          <ul className="space-y-2 text-sm font-semibold text-muted-foreground">
            <li>
              <Link href="/menu" className="cursor-pointer transition hover:text-primary">
                Our Menu
              </Link>
            </li>
            <li>
              <Link href="/reservation" className="cursor-pointer transition hover:text-primary">
                Reservations
              </Link>
            </li>
            <li>
              <Link href="/order-tracking" className="cursor-pointer transition hover:text-primary">
                Track Order
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary">Operating Hours</h2>
          <ul className="space-y-2 text-sm font-semibold text-muted-foreground">
            <li>Daily: 10:00 AM - 11:00 PM</li>
            <li>Delivery: 11:00 AM - 10:30 PM</li>
            <li>Dhaka, Bangladesh</li>
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary">Security & Payments</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            PCI DSS ready checkout planning for SSLCOMMERZ, bKash, Nagad, card, and cash payment flows.
          </p>
        </div>
      </div>
      <div className="mx-auto mt-10 border-t border-border pt-6 text-sm font-semibold text-muted-foreground text-center">
        &copy; 2026 আহার (Ahar) Restaurant Systems. All rights reserved.
      </div>
    </footer>
  )
}

export default PublicFooter
