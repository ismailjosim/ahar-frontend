"use client"

import { useEffect, useState } from "react"
import { CalendarCheck } from "lucide-react"
import type { RestaurantSettings } from "@/types/settings.interface"

const inputClass =
  "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"

export default function SettingsManagerContent() {
  const [settings, setSettings] = useState<RestaurantSettings | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  async function loadSettings() {
    const res = await fetch("/api/settings")
    const body = await res.json()
    setSettings(body)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSettings()
  }, [])

  function updateField<K extends keyof RestaurantSettings>(key: K, value: RestaurantSettings[K]) {
    setSettings((current) => (current ? { ...current, [key]: value } : current))
    setMessage("")
  }

  async function save() {
    if (!settings) return
    if (!settings.restaurantName.trim() || !settings.supportPhone.trim()) {
      setMessage("Restaurant name and support phone are required.")
      return
    }

    setSaving(true)
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    })
    setSaving(false)

    if (res.ok) {
      setSettings(await res.json())
      setMessage("Settings saved for this app session.")
    } else {
      setMessage("Failed to save settings.")
    }
  }

  if (!settings) {
    return <div className="rounded-3xl border border-border bg-card p-6 text-muted-foreground">Loading settings...</div>
  }

  return (
    <div className="space-y-6">
      <SettingsSection title="Restaurant Profile">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Restaurant Name"
            value={settings.restaurantName}
            onChange={(value) => updateField("restaurantName", value)}
          />
          <TextField
            label="Support Phone"
            value={settings.supportPhone}
            onChange={(value) => updateField("supportPhone", value)}
          />
          <TextField
            label="Support Email"
            value={settings.supportEmail}
            onChange={(value) => updateField("supportEmail", value)}
          />
          <TextField label="Address" value={settings.address} onChange={(value) => updateField("address", value)} />
        </div>
      </SettingsSection>

      <SettingsSection title="Hours, Delivery & Tax">
        <div className="grid gap-4 md:grid-cols-3">
          <TextField
            label="Opening Time"
            type="time"
            value={settings.openingTime}
            onChange={(value) => updateField("openingTime", value)}
          />
          <TextField
            label="Closing Time"
            type="time"
            value={settings.closingTime}
            onChange={(value) => updateField("closingTime", value)}
          />
          <NumberField
            label="Delivery Fee"
            value={settings.deliveryFee}
            onChange={(value) => updateField("deliveryFee", value)}
          />
          <NumberField
            label="Free Delivery Minimum"
            value={settings.freeDeliveryMin}
            onChange={(value) => updateField("freeDeliveryMin", value)}
          />
          <NumberField
            label="VAT Rate %"
            value={settings.vatRate}
            onChange={(value) => updateField("vatRate", value)}
          />
          <NumberField
            label="Service Charge %"
            value={settings.serviceChargeRate}
            onChange={(value) => updateField("serviceChargeRate", value)}
          />
        </div>
      </SettingsSection>

      <SettingsSection title="Payments & Notifications">
        <div className="grid gap-3 md:grid-cols-2">
          <Toggle
            label="Cash on Delivery"
            checked={settings.acceptCod}
            onChange={(value) => updateField("acceptCod", value)}
          />
          <Toggle
            label="bKash"
            checked={settings.acceptBkash}
            onChange={(value) => updateField("acceptBkash", value)}
          />
          <Toggle
            label="Nagad"
            checked={settings.acceptNagad}
            onChange={(value) => updateField("acceptNagad", value)}
          />
          <Toggle
            label="SSLCOMMERZ"
            checked={settings.acceptSslcommerz}
            onChange={(value) => updateField("acceptSslcommerz", value)}
          />
          <Toggle
            label="Low Stock Alerts"
            checked={settings.lowStockAlerts}
            onChange={(value) => updateField("lowStockAlerts", value)}
          />
          <Toggle
            label="Reservation Alerts"
            checked={settings.reservationAlerts}
            onChange={(value) => updateField("reservationAlerts", value)}
          />
          <Toggle
            label="Payment Alerts"
            checked={settings.paymentAlerts}
            onChange={(value) => updateField("paymentAlerts", value)}
          />
        </div>
      </SettingsSection>

      <SettingsSection title="Reservations" icon={<CalendarCheck className="size-5 text-primary" />}>
        <div className="grid gap-4 md:grid-cols-2">
          <NumberField
            label="Max bookings per time slot"
            value={settings.maxTablesPerSlot}
            onChange={(value) => updateField("maxTablesPerSlot", value)}
            min={1}
            max={50}
          />
          <NumberField
            label="Slot gap (minutes)"
            value={settings.reservationSlotGap}
            onChange={(value) => updateField("reservationSlotGap", value)}
            min={15}
            max={120}
          />
        </div>
      </SettingsSection>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-primary-hover disabled:pointer-events-none disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
        <button
          onClick={loadSettings}
          className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-bold transition hover:bg-muted"
        >
          Reset Changes
        </button>
        {message && <p className="text-sm font-semibold text-muted-foreground">{message}</p>}
      </div>
    </div>
  )
}

function SettingsSection({
  children,
  title,
  icon,
}: {
  children: React.ReactNode
  title: string
  icon?: React.ReactNode
}) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-sm">
      <h2 className="font-bengali flex items-center gap-2 text-xl font-black">
        {icon}
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}

function TextField({
  label,
  onChange,
  type = "text",
  value,
}: {
  label: string
  onChange: (value: string) => void
  type?: string
  value: string
}) {
  return (
    <label className="space-y-1.5 text-sm font-semibold">
      <span className="block text-xs font-black uppercase tracking-wider text-muted-foreground">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} type={type} className={inputClass} />
    </label>
  )
}

function NumberField({
  label,
  onChange,
  value,
  min,
  max,
}: {
  label: string
  onChange: (value: number) => void
  value: number
  min?: number
  max?: number
}) {
  return (
    <label className="space-y-1.5 text-sm font-semibold">
      <span className="block text-xs font-black uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        type="number"
        min={min}
        max={max}
        className={inputClass}
      />
    </label>
  )
}

function Toggle({ checked, label, onChange }: { checked: boolean; label: string; onChange: (value: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-muted/30 p-4 text-sm font-bold">
      {label}
      <input
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
        className="size-4 accent-primary"
      />
    </label>
  )
}
