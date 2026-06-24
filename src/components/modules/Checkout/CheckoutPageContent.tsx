"use client"

import type { FormEvent, ReactNode } from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CreditCard, Loader2, LockKeyhole, MapPin, Phone, ShieldCheck, ShoppingBag, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { calculateLineTotal, formatCurrency } from "@/lib/cart.utils"
import { defaultCheckoutForm, deliveryAreas, fulfillmentOptions, paymentOptions } from "@/lib/checkout.constant"
import { normalizeBDPhone, validateBDPhone } from "@/lib/phone.utils"
import { cn } from "@/lib/utils"
import { useCartStore } from "@/store/cart.store"
import type { CheckoutFormData, CheckoutFulfillmentMode, CheckoutPaymentMethod } from "@/types/checkout.interface"

const fieldClass =
  "h-11 w-full rounded-xl border border-border bg-background px-4 text-xs font-bold outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/25"

const CheckoutPageContent = () => {
  const router = useRouter()
  const cartItems = useCartStore((s) => s.items)
  const appliedCoupon = useCartStore((s) => s.appliedCoupon)
  const setDelivery = useCartStore((s) => s.setDelivery)
  const getTotals = useCartStore((s) => s.getTotals)
  const clearCart = useCartStore((s) => s.clearCart)
  const markOrderPlaced = useCartStore((s) => s.markOrderPlaced)

  const [fulfillmentMode, setFulfillmentMode] = useState<CheckoutFulfillmentMode>("delivery")
  const [paymentMethod, setPaymentMethod] = useState<CheckoutPaymentMethod>("cod")
  const [formData, setFormData] = useState<CheckoutFormData>(defaultCheckoutForm)
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const hasDelivery = fulfillmentMode === "delivery"

  // Keep the cart store delivery flag in sync so getTotals reflects the choice.
  useEffect(() => {
    setDelivery(hasDelivery)
  }, [hasDelivery, setDelivery])

  const totals = getTotals()
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const updateFormField = (field: keyof CheckoutFormData, value: string) => {
    setFormData((currentData) => ({ ...currentData, [field]: value }))
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }))
    setSubmitError("")
  }

  const validateForm = () => {
    const nextErrors: Partial<Record<keyof CheckoutFormData, string>> = {}

    if (!formData.fullName.trim()) {
      nextErrors.fullName = "Full name is required."
    }

    if (!validateBDPhone(formData.phone.trim())) {
      nextErrors.phone = "Use a valid BD mobile number, for example 01712345678."
    }

    if (hasDelivery && !formData.streetAddress.trim()) {
      nextErrors.streetAddress = "Delivery flat, house, and road details are required."
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  const handlePlaceOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitError("")

    const payload = {
      customerName: formData.fullName.trim(),
      phone: normalizeBDPhone(formData.phone),
      email: formData.email.trim() || undefined,
      fulfillmentType: fulfillmentMode,
      items: cartItems.map((item) => ({
        menuItemId: item.id,
        nameSnapshot: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        selectedVariant: item.variant ? { name: item.variant } : undefined,
        selectedAddOns: item.addOns.length > 0 ? item.addOns : undefined,
        lineTotal: calculateLineTotal(item),
      })),
      address:
        fulfillmentMode === "delivery" ? `${formData.streetAddress}, ${formData.area}, ${formData.city}` : undefined,
      notes: formData.orderNote.trim() || undefined,
      paymentMethod,
      couponCode: appliedCoupon?.code ?? undefined,
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setSubmitError(err.error ?? err.message ?? "Failed to place order. Please try again.")
        setIsSubmitting(false)
        return
      }

      const order = await res.json()

      markOrderPlaced()
      clearCart()

      if (paymentMethod === "sslcommerz") {
        const initRes = await fetch("/api/payments/sslcommerz/init", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: order.id }),
        })

        if (!initRes.ok) {
          const err = await initRes.json().catch(() => ({}))
          setSubmitError(
            err.error ??
              err.message ??
              "Order placed, but failed to connect to payment gateway. Please contact support.",
          )
          setIsSubmitting(false)
          return
        }

        const { data } = await initRes.json()
        if (data?.gatewayUrl) {
          window.location.href = data.gatewayUrl
          return
        } else {
          setSubmitError("Order placed, but payment gateway URL was not found.")
          setIsSubmitting(false)
          return
        }
      }

      if (paymentMethod === "bkash" || paymentMethod === "nagad") {
        await new Promise((resolve) => setTimeout(resolve, 1500))
      }

      router.push(`/order-tracking?id=${order.id}`)
    } catch {
      setSubmitError("Network error. Please check your connection and try again.")
      setIsSubmitting(false)
    } finally {
      if (paymentMethod !== "sslcommerz") {
        setIsSubmitting(false)
      }
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
            Please configure billing, delivery, and payment details. Cash on delivery is live now; online payment
            gateways are coming soon.
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
                      setSubmitError("")
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
                      setSubmitError("")
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
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-3 text-xs">
                  <div>
                    <p className="font-black">{item.name}</p>
                    <p className="mt-1 text-muted-foreground">
                      {item.quantity} x {formatCurrency(item.unitPrice)}
                      {item.variant ? ` • ${item.variant}` : ""}
                    </p>
                    {item.addOns.length > 0 ? (
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        + {item.addOns.map((addOn) => addOn.name).join(", ")}
                      </p>
                    ) : null}
                  </div>
                  <span className="font-black text-primary">{formatCurrency(calculateLineTotal(item))}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3 border-t border-border pt-4 text-sm text-muted-foreground">
              <InvoiceLine label="Cart Subtotal" value={formatCurrency(totals.subtotal)} />
              {totals.discount > 0 ? (
                <InvoiceLine
                  isSuccess
                  label={appliedCoupon ? `Coupon (${appliedCoupon.code})` : "Discount"}
                  value={`-${formatCurrency(totals.discount)}`}
                />
              ) : null}
              <InvoiceLine label="Govt VAT (5%)" value={formatCurrency(totals.vat)} />
              <InvoiceLine
                label="Delivery Charge"
                value={hasDelivery ? formatCurrency(totals.deliveryCharge) : "FREE"}
              />
              <div className="flex justify-between border-t border-border pt-4 text-base font-black text-foreground">
                <span>Total Payable</span>
                <span className="text-2xl text-primary">{formatCurrency(totals.total)}</span>
              </div>
              <p className="text-[10px] leading-4 text-muted-foreground">
                Final total is confirmed by the server when your order is placed.
              </p>
            </div>

            {submitError ? (
              <div className="mt-5 rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-xs font-bold text-destructive">
                {submitError}
              </div>
            ) : null}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full rounded-full border border-accent/40 py-6 font-black shadow-lg shadow-primary/20"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <LockKeyhole />}
              {isSubmitting
                ? paymentMethod === "sslcommerz"
                  ? "Redirecting to SSLCOMMERZ..."
                  : paymentMethod === "bkash"
                    ? "Redirecting to bKash..."
                    : paymentMethod === "nagad"
                      ? "Redirecting to Nagad..."
                      : "Placing Order..."
                : "Securely Place Order"}
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
