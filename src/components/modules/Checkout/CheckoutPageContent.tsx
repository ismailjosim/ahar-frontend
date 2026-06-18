"use client"

import type { FormEvent, ReactNode } from "react"
import { useMemo, useState } from "react"
import Link from "next/link"
import { CheckCircle2, CreditCard, LockKeyhole, MapPin, Phone, ShieldCheck, ShoppingBag, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { demoCartItems } from "@/lib/cart.constant"
import { calculateCartTotals, calculateLineTotal, formatCurrency } from "@/lib/cart.utils"
import { defaultCheckoutForm, deliveryAreas, fulfillmentOptions, paymentOptions } from "@/lib/checkout.constant"
import { cn } from "@/lib/utils"
import type {
  CheckoutFormData,
  CheckoutFulfillmentMode,
  CheckoutPaymentMethod,
  MockOrderConfirmation,
} from "@/types/checkout.interface"

const bdPhoneRegex = /^(1[3-9]\d{8})$/

const fieldClass =
  "h-11 w-full rounded-xl border border-border bg-background px-4 text-xs font-bold outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25"

const CheckoutPageContent = () => {
  const [fulfillmentMode, setFulfillmentMode] = useState<CheckoutFulfillmentMode>("delivery")
  const [paymentMethod, setPaymentMethod] = useState<CheckoutPaymentMethod>("cod")
  const [formData, setFormData] = useState<CheckoutFormData>(defaultCheckoutForm)
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({})
  const [confirmation, setConfirmation] = useState<MockOrderConfirmation | null>(null)

  const hasDelivery = fulfillmentMode === "delivery"
  const totals = useMemo(() => calculateCartTotals(demoCartItems, hasDelivery), [hasDelivery])
  const cartCount = demoCartItems.reduce((total, item) => total + item.quantity, 0)

  const updateFormField = (field: keyof CheckoutFormData, value: string) => {
    setFormData((currentData) => ({ ...currentData, [field]: value }))
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }))
    setConfirmation(null)
  }

  const validateForm = () => {
    const nextErrors: Partial<Record<keyof CheckoutFormData, string>> = {}

    if (!formData.fullName.trim()) {
      nextErrors.fullName = "Full name is required."
    }

    if (!bdPhoneRegex.test(formData.phone.trim())) {
      nextErrors.phone = "Use a valid BD mobile number, for example 1712345678."
    }

    if (hasDelivery && !formData.streetAddress.trim()) {
      nextErrors.streetAddress = "Delivery flat, house, and road details are required."
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  const handlePlaceOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validateForm()) return

    setConfirmation({
      orderId: `AHAR-${Date.now().toString().slice(-6)}`,
      customerName: formData.fullName.trim(),
      fulfillmentMode,
      paymentMethod,
      payableTotal: totals.total,
    })
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="motion-reveal mb-8">
        <nav className="mb-3 flex text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          <Link href="/" className="cursor-pointer transition hover:text-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/cart" className="cursor-pointer transition hover:text-primary">
            Shopping Bag
          </Link>
          <span className="mx-2">/</span>
          <span className="text-primary">Secure Checkout</span>
        </nav>

        <div className="flex flex-col gap-3">
          <h1 className="font-bengali flex items-center gap-3 text-3xl font-black leading-tight sm:text-4xl">
            <ShieldCheck className="size-8 text-primary" />
            নিরাপদ পেমেন্ট ও চেকআউট
          </h1>
          <p className="max-w-2xl text-xs leading-5 text-muted-foreground">
            Please configure billing, delivery, and payment details. This is a local mock checkout until backend APIs
            and live payment gateways are connected.
          </p>
        </div>
      </section>

      <form onSubmit={handlePlaceOrder} className="grid items-start gap-10 lg:grid-cols-12">
        <section className="space-y-6 lg:col-span-8">
          <CheckoutPanel step="১" title="Fulfillment Method" required>
            <div className="grid gap-4 sm:grid-cols-2">
              {fulfillmentOptions.map((option) => {
                const isSelected = fulfillmentMode === option.id

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setFulfillmentMode(option.id as CheckoutFulfillmentMode)
                      setConfirmation(null)
                    }}
                    className={cn(
                      "motion-soft-hover flex cursor-pointer items-center justify-between rounded-2xl border-2 bg-background p-4 text-left transition",
                      isSelected
                        ? "border-primary bg-primary-soft/70 dark:border-accent dark:bg-warning-soft"
                        : "border-border hover:border-accent/70",
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-2xl">{option.emoji}</span>
                      <span>
                        <span className="block text-xs font-extrabold">{option.title}</span>
                        <span className="mt-1 block text-[10px] font-bold text-muted-foreground">
                          {option.description}
                        </span>
                      </span>
                    </span>
                    <span
                      className={cn(
                        "flex size-5 items-center justify-center rounded-full border text-[10px]",
                        isSelected ? "border-primary bg-primary text-white" : "border-border text-transparent",
                      )}
                    >
                      ✓
                    </span>
                  </button>
                )
              })}
            </div>
          </CheckoutPanel>

          <CheckoutPanel step="২" title="Customer Information" required>
            <div className="grid gap-4 sm:grid-cols-2">
              <CheckoutInput
                error={errors.fullName}
                icon={<User className="size-4" />}
                label="Full Name"
                onChange={(value) => updateFormField("fullName", value)}
                placeholder="Ismail Hossain"
                value={formData.fullName}
              />
              <CheckoutInput
                label="Email Address"
                onChange={(value) => updateFormField("email", value)}
                placeholder="name@example.com"
                type="email"
                value={formData.email}
              />
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Bangladeshi Mobile Phone Number
                </label>
                <div className="flex">
                  <span className="flex h-11 items-center rounded-l-xl border border-r-0 border-border bg-secondary px-4 text-xs font-black text-muted-foreground">
                    +880
                  </span>
                  <input
                    value={formData.phone}
                    onChange={(event) => updateFormField("phone", event.target.value)}
                    className={cn(fieldClass, "rounded-l-none")}
                    inputMode="numeric"
                    placeholder="1712345678"
                  />
                </div>
                {errors.phone ? (
                  <p className="text-[10px] font-bold text-destructive">{errors.phone}</p>
                ) : (
                  <p className="text-[10px] font-semibold text-muted-foreground">
                    SMS with the live order tracking link will be delivered to this number.
                  </p>
                )}
              </div>
            </div>
          </CheckoutPanel>

          {hasDelivery ? (
            <CheckoutPanel step="৩" title="Delivery Destination Address" required>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                    City / Division
                  </span>
                  <select
                    value={formData.city}
                    onChange={(event) => updateFormField("city", event.target.value)}
                    className={cn(fieldClass, "cursor-pointer")}
                  >
                    <option>Dhaka City</option>
                  </select>
                </label>
                <label className="space-y-1.5">
                  <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">Area</span>
                  <select
                    value={formData.area}
                    onChange={(event) => updateFormField("area", event.target.value)}
                    className={cn(fieldClass, "cursor-pointer")}
                  >
                    {deliveryAreas.map((area) => (
                      <option key={area}>{area}</option>
                    ))}
                  </select>
                </label>
                <CheckoutInput
                  className="sm:col-span-2"
                  error={errors.streetAddress}
                  icon={<MapPin className="size-4" />}
                  label="Street Location & Flat / House No."
                  onChange={(value) => updateFormField("streetAddress", value)}
                  placeholder="Flat 4B, House 12, Road 27"
                  value={formData.streetAddress}
                />
              </div>
            </CheckoutPanel>
          ) : (
            <CheckoutPanel step="৩" title="Pickup Branch">
              <div className="rounded-2xl border border-accent/40 bg-warning-soft p-4 text-sm font-bold text-warning-foreground">
                Pickup from Ahar Dhanmondi Branch. Preparation window: 25-35 minutes after confirmation.
              </div>
            </CheckoutPanel>
          )}

          <CheckoutPanel step="৪" title="Order Note & Payment Method">
            <label className="block space-y-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                Kitchen / Delivery Note
              </span>
              <textarea
                value={formData.orderNote}
                onChange={(event) => updateFormField("orderNote", event.target.value)}
                className="min-h-24 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-xs font-bold outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25"
                placeholder="Less oil, call before arrival, extra salad..."
              />
            </label>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {paymentOptions.map((option) => {
                const isSelected = paymentMethod === option.value

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setPaymentMethod(option.value)
                      setConfirmation(null)
                    }}
                    className={cn(
                      "motion-soft-hover flex cursor-pointer items-center justify-between rounded-2xl border-2 bg-background p-4 text-left transition",
                      isSelected
                        ? "border-primary bg-primary-soft/70 dark:border-accent dark:bg-warning-soft"
                        : "border-border hover:border-accent/70",
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-2xl">{option.emoji}</span>
                      <span>
                        <span className="block text-xs font-extrabold">{option.title}</span>
                        <span className="mt-1 block text-[9px] font-semibold text-muted-foreground">
                          {option.description}
                        </span>
                      </span>
                    </span>
                    <span className="rounded-full bg-muted px-2 py-1 text-[9px] font-black text-primary">
                      {option.badge}
                    </span>
                  </button>
                )
              })}
            </div>
          </CheckoutPanel>
        </section>

        <aside className="sticky top-24 space-y-6 lg:col-span-4">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-md">
            <div className="border-b border-border pb-4">
              <h2 className="font-bengali flex items-center gap-2 text-xl font-black">
                <ShoppingBag className="size-5 text-primary" />
                অর্ডার ইনভয়েস
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">{cartCount} items prepared for secure checkout.</p>
            </div>

            <div className="mt-5 space-y-4">
              {demoCartItems.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-3 text-xs">
                  <div>
                    <p className="font-black">{item.name}</p>
                    <p className="mt-1 text-muted-foreground">
                      {item.quantity} x {item.variant}
                    </p>
                  </div>
                  <span className="font-black text-primary">{formatCurrency(calculateLineTotal(item))}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3 border-t border-border pt-4 text-sm text-muted-foreground">
              <InvoiceLine label="Cart Subtotal" value={formatCurrency(totals.subtotal)} />
              <InvoiceLine isSuccess label="Coupon Discount (10%)" value={`-${formatCurrency(totals.discount)}`} />
              <InvoiceLine label="Govt VAT (5%)" value={formatCurrency(totals.vat)} />
              <InvoiceLine
                label="Delivery Charge"
                value={hasDelivery ? formatCurrency(totals.deliveryCharge) : "FREE"}
              />
              <div className="flex justify-between border-t border-border pt-4 text-base font-black text-foreground">
                <span>Total Payable</span>
                <span className="text-2xl text-primary">{formatCurrency(totals.total)}</span>
              </div>
            </div>

            <Button
              type="submit"
              className="mt-6 w-full rounded-full border border-accent/40 py-6 font-black shadow-lg shadow-primary/20"
            >
              <LockKeyhole />
              Securely Place Order
            </Button>

            <div className="mt-4 flex items-center justify-center gap-3 text-lg">
              <span title="PCI Compliant">🔒</span>
              <span title="Safe Payments">✅</span>
              <span title="Encrypted Checkout">🛡</span>
              <span title="Fast Delivery">⚡</span>
            </div>
            <p className="mt-3 text-center text-[10px] leading-4 text-muted-foreground">
              Payment gateway connection is a placeholder until SSLCOMMERZ backend integration is ready.
            </p>
          </div>

          {confirmation ? (
            <div className="motion-reveal rounded-3xl border border-success/40 bg-success-soft p-5 text-success-foreground shadow-sm">
              <h3 className="flex items-center gap-2 text-sm font-black text-success">
                <CheckCircle2 className="size-5" />
                Mock order created
              </h3>
              <div className="mt-3 space-y-1 text-xs font-bold text-foreground">
                <p>Order ID: {confirmation.orderId}</p>
                <p>Customer: {confirmation.customerName}</p>
                <p>Mode: {confirmation.fulfillmentMode}</p>
                <p>Payment: {confirmation.paymentMethod.toUpperCase()}</p>
                <p>Total: {formatCurrency(confirmation.payableTotal)}</p>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-border bg-secondary p-5 text-xs leading-5 text-muted-foreground">
              <p className="flex items-start gap-2">
                <CreditCard className="mt-0.5 size-4 shrink-0 text-accent" />
                COD is active first. SSLCOMMERZ is shown as the future payment gateway placeholder.
              </p>
              <p className="mt-3 flex items-start gap-2">
                <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
                Phone validation follows the demo checkout: 10 digits after +880.
              </p>
            </div>
          )}
        </aside>
      </form>
    </div>
  )
}

interface CheckoutPanelProps {
  children: ReactNode
  required?: boolean
  step: string
  title: string
}

const CheckoutPanel = ({ children, required, step, title }: CheckoutPanelProps) => (
  <section className="motion-reveal rounded-3xl border border-border bg-card p-6 shadow-sm">
    <h2 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wider">
      <span className="flex size-6 items-center justify-center rounded-full bg-primary-soft text-xs text-primary">
        {step}
      </span>
      {title}
      {required ? <span className="text-destructive">*</span> : null}
    </h2>
    {children}
  </section>
)

interface CheckoutInputProps {
  className?: string
  error?: string
  icon?: ReactNode
  label: string
  onChange: (value: string) => void
  placeholder: string
  type?: string
  value: string
}

const CheckoutInput = ({
  className,
  error,
  icon,
  label,
  onChange,
  placeholder,
  type = "text",
  value,
}: CheckoutInputProps) => (
  <label className={cn("space-y-1.5", className)}>
    <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">{label}</span>
    <span className="relative block">
      {icon ? <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span> : null}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(fieldClass, icon && "pl-11")}
        placeholder={placeholder}
        type={type}
      />
    </span>
    {error ? <p className="text-[10px] font-bold text-destructive">{error}</p> : null}
  </label>
)

interface InvoiceLineProps {
  isSuccess?: boolean
  label: string
  value: string
}

const InvoiceLine = ({ isSuccess, label, value }: InvoiceLineProps) => (
  <div className={cn("flex justify-between", isSuccess && "text-success")}>
    <span>{label}</span>
    <span className="font-extrabold text-foreground">{value}</span>
  </div>
)

export default CheckoutPageContent
