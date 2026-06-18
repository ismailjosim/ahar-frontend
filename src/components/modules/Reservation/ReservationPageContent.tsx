"use client"

import type { FormEvent, ReactNode } from "react"
import { useMemo, useState } from "react"
import Link from "next/link"
import { CalendarDays, CheckCircle2, Clock3, MessageSquareText, Phone, Users, Utensils } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  defaultReservationForm,
  reservationGuestOptions,
  reservationHighlights,
  reservationTablePreferences,
  reservationTimeSlots,
} from "@/lib/reservation.constant"
import { cn } from "@/lib/utils"
import type { ReservationConfirmation, ReservationFormData, ReservationFormErrors } from "@/types/reservation.interface"

const bdPhoneRegex = /^(?:\+?880|0)?1[3-9]\d{8}$/

const fieldClass =
  "h-11 w-full rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/25"

export default function ReservationPageContent() {
  const [formData, setFormData] = useState<ReservationFormData>(defaultReservationForm)
  const [errors, setErrors] = useState<ReservationFormErrors>({})
  const [confirmation, setConfirmation] = useState<ReservationConfirmation | null>(null)
  const [submitError, setSubmitError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), [])

  const updateField = (field: keyof ReservationFormData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setSubmitError("")
    setConfirmation(null)
  }

  const validateForm = () => {
    const nextErrors: ReservationFormErrors = {}

    if (!formData.customer.trim()) {
      nextErrors.customer = "Guest name is required."
    }

    if (!bdPhoneRegex.test(formData.phone.trim())) {
      nextErrors.phone = "Use a valid BD mobile number, for example 01712345678."
    }

    if (!formData.date) {
      nextErrors.date = "Reservation date is required."
    } else if (formData.date < minDate) {
      nextErrors.date = "Reservation date cannot be in the past."
    }

    if (!formData.timeSlot) {
      nextErrors.timeSlot = "Choose a preferred time."
    }

    const guests = Number(formData.guests)
    if (!Number.isInteger(guests) || guests < 1 || guests > 20) {
      nextErrors.guests = "Guest count must be between 1 and 20."
    }

    if (!formData.tablePreference) {
      nextErrors.tablePreference = "Choose a table preference."
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitError("")

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: formData.customer.trim(),
          phone: formData.phone.trim(),
          guests: Number(formData.guests),
          time: `${formData.date}, ${formData.timeSlot}`,
          table: formData.tablePreference,
          status: "Pending",
          request: formData.request.trim(),
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to create reservation")
      }

      const created = await res.json()
      setConfirmation(created)
      setFormData(defaultReservationForm)
    } catch {
      setSubmitError("Reservation could not be submitted. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="motion-reveal mb-8">
        <nav className="mb-3 flex text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          <Link href="/" className="cursor-pointer transition hover:text-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-primary">Table Reservation</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <h1 className="font-bengali flex items-center gap-3 text-3xl font-black leading-tight sm:text-4xl">
              <Utensils className="size-8 text-primary" />
              রাজকীয় টেবিল রিজার্ভেশন
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Book a table for lunch, dinner, family gatherings, or a quiet premium dining moment. Your request is sent
              directly to the reservation management queue.
            </p>
          </div>

          <div className="rounded-2xl border border-accent/40 bg-primary-soft p-4 dark:bg-warning-soft">
            <p className="font-bengali text-sm font-bold text-primary dark:text-accent">আজকের বুকিং টিপস</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Dinner slots fill up quickly after 7:00 PM. Reserve early for window and family booth preferences.
            </p>
          </div>
        </div>
      </section>

      <div className="grid items-start gap-8 lg:grid-cols-12">
        <form onSubmit={handleSubmit} className="space-y-6 lg:col-span-8">
          <ReservationPanel step="১" title="Guest Details" required>
            <div className="grid gap-4 sm:grid-cols-2">
              <ReservationInput
                error={errors.customer}
                label="Guest Name"
                onChange={(value) => updateField("customer", value)}
                placeholder="Ismail Hossain"
                value={formData.customer}
              />

              <ReservationInput
                error={errors.phone}
                icon={<Phone className="size-4" />}
                label="Mobile Number"
                onChange={(value) => updateField("phone", value)}
                placeholder="01712345678"
                value={formData.phone}
              />
            </div>
          </ReservationPanel>

          <ReservationPanel step="২" title="Reservation Schedule" required>
            <div className="grid gap-4 sm:grid-cols-3">
              <ReservationInput
                error={errors.date}
                icon={<CalendarDays className="size-4" />}
                label="Date"
                min={minDate}
                onChange={(value) => updateField("date", value)}
                type="date"
                value={formData.date}
              />

              <ReservationSelect
                error={errors.timeSlot}
                icon={<Clock3 className="size-4" />}
                label="Time Slot"
                onChange={(value) => updateField("timeSlot", value)}
                options={reservationTimeSlots}
                value={formData.timeSlot}
              />

              <ReservationSelect
                error={errors.guests}
                icon={<Users className="size-4" />}
                label="Guests"
                onChange={(value) => updateField("guests", value)}
                options={reservationGuestOptions}
                value={formData.guests}
              />
            </div>
          </ReservationPanel>

          <ReservationPanel step="৩" title="Table Preference">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {reservationTablePreferences.map((table) => {
                const isSelected = formData.tablePreference === table

                return (
                  <button
                    key={table}
                    type="button"
                    onClick={() => updateField("tablePreference", table)}
                    className={cn(
                      "motion-soft-hover rounded-2xl border-2 bg-background p-4 text-left text-xs font-extrabold transition",
                      isSelected
                        ? "border-primary bg-primary-soft text-primary dark:border-accent dark:bg-warning-soft dark:text-accent"
                        : "border-border text-foreground hover:border-accent/70",
                    )}
                  >
                    <span className="flex items-center justify-between gap-3">
                      {table}
                      <span
                        className={cn(
                          "flex size-5 items-center justify-center rounded-full border text-[10px]",
                          isSelected ? "border-primary bg-primary text-white" : "border-border text-transparent",
                        )}
                      >
                        ✓
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
            {errors.tablePreference && (
              <p className="mt-2 text-xs font-semibold text-destructive">{errors.tablePreference}</p>
            )}
          </ReservationPanel>

          <ReservationPanel step="৪" title="Special Request">
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-muted-foreground">
                <MessageSquareText className="size-4" />
                Notes for the host
              </label>
              <textarea
                value={formData.request}
                onChange={(event) => updateField("request", event.target.value)}
                className="min-h-28 w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground outline-none transition placeholder:text-muted-foreground focus:border-accent focus:ring-2 focus:ring-accent/25"
                placeholder="Birthday setup, high chair, quiet corner, allergy note..."
              />
            </div>
          </ReservationPanel>

          {submitError && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm font-semibold text-destructive">
              {submitError}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-2xl border border-accent/40 text-sm font-black sm:w-auto sm:px-8"
          >
            {isSubmitting ? "Submitting..." : "Confirm Reservation"}
          </Button>
        </form>

        <aside className="space-y-5 lg:col-span-4">
          {confirmation && (
            <div className="motion-reveal rounded-3xl border border-success/30 bg-success-soft p-6 text-success-foreground shadow-sm">
              <CheckCircle2 className="size-10 text-success" />
              <h2 className="font-bengali mt-4 text-xl font-black text-foreground">Reservation Requested</h2>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-bold text-foreground">ID:</span> {confirmation.id}
                </p>
                <p>
                  <span className="font-bold text-foreground">Guest:</span> {confirmation.customer}
                </p>
                <p>
                  <span className="font-bold text-foreground">Time:</span> {confirmation.time}
                </p>
                <p>
                  <span className="font-bold text-foreground">Table:</span> {confirmation.table}
                </p>
                <p>
                  <span className="font-bold text-foreground">Status:</span> {confirmation.status}
                </p>
              </div>
              <Button asChild variant="outline" className="mt-5 w-full rounded-xl bg-card">
                <Link href="/dashboard/reservations">View Admin Queue</Link>
              </Button>
            </div>
          )}

          <div className="rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-sm">
            <h2 className="font-bengali text-xl font-black">Booking Highlights</h2>
            <div className="mt-5 space-y-4">
              {reservationHighlights.map((highlight) => (
                <div key={highlight.label} className="rounded-2xl border border-border bg-muted/40 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                      {highlight.label}
                    </p>
                    <p className="text-sm font-black text-primary">{highlight.value}</p>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{highlight.text}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

interface ReservationPanelProps {
  children: ReactNode
  required?: boolean
  step: string
  title: string
}

const ReservationPanel = ({ children, required, step, title }: ReservationPanelProps) => (
  <section className="rounded-3xl border border-border bg-card p-5 text-card-foreground shadow-sm sm:p-6">
    <div className="mb-5 flex items-center gap-3">
      <span className="flex size-8 items-center justify-center rounded-full bg-primary-soft text-xs font-black text-primary">
        {step}
      </span>
      <h2 className="font-bengali text-lg font-black">{title}</h2>
      {required && (
        <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-accent">
          Required
        </span>
      )}
    </div>
    {children}
  </section>
)

interface ReservationInputProps {
  error?: string
  icon?: ReactNode
  label: string
  min?: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  value: string
}

const ReservationInput = ({
  error,
  icon,
  label,
  min,
  onChange,
  placeholder,
  type = "text",
  value,
}: ReservationInputProps) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-muted-foreground">
      {icon}
      {label}
    </label>
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={fieldClass}
      min={min}
      placeholder={placeholder}
      type={type}
    />
    {error && <p className="text-xs font-semibold text-destructive">{error}</p>}
  </div>
)

interface ReservationSelectProps {
  error?: string
  icon?: ReactNode
  label: string
  onChange: (value: string) => void
  options: string[]
  value: string
}

const ReservationSelect = ({ error, icon, label, onChange, options, value }: ReservationSelectProps) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-muted-foreground">
      {icon}
      {label}
    </label>
    <select value={value} onChange={(event) => onChange(event.target.value)} className={fieldClass}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    {error && <p className="text-xs font-semibold text-destructive">{error}</p>}
  </div>
)
