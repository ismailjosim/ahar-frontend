"use client"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bengali text-3xl font-bold text-foreground">সেটিংস (Settings)</h1>
        <p className="font-bengali mt-2 text-muted-foreground">রেস্তোরাঁর সেটিংস এবং সাধারণ কনফিগারেশন সমন্বয় করুন</p>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Settings UI placeholder — add company details, taxes, and integrations here.
        </p>
      </div>
    </div>
  )
}
