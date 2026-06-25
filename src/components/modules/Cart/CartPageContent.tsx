"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, BadgePercent, Minus, Plus, ShoppingBag, Trash2, Utensils } from "lucide-react"

import { Button } from "@/components/ui/button"
import { calculateLineTotal, formatCurrency } from "@/lib/cart.utils"
import { cartDeliveryCharge } from "@/lib/cart.constant"
import { usePublicSettings } from "@/lib/use-public-settings"
import { useCartStore } from "@/store/cart.store"

const CartPageContent = () => {
  const { items: cartItems, updateQuantity, removeItem, getTotals, appliedCoupon } = useCartStore()
  const [couponCode, setCouponCode] = useState("")
  const publicSettings = usePublicSettings()

  const totals = getTotals()
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const deliveryFee = publicSettings?.deliveryFee ?? cartDeliveryCharge
  const freeDeliveryMin = publicSettings?.freeDeliveryMin ?? 0
  const isFreeDelivery = freeDeliveryMin > 0 && totals.subtotal >= freeDeliveryMin

  if (cartItems.length === 0) {
    return (
      <section className="mx-auto flex min-h-[62vh] max-w-4xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="motion-reveal rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-accent/15 text-5xl">🍽</div>
          <h1 className="font-bengali mt-6 text-3xl font-black">আপনার শপিং ব্যাগ খালি</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            Add your favorite Bengali dishes from the menu to start your premium Ahar order.
          </p>
          <Button asChild className="mt-6 rounded-full border border-accent/40 px-6 py-6">
            <Link href="/menu">
              <Utensils />
              Explore Delicious Menu
            </Link>
          </Button>
        </div>
      </section>
    )
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="motion-reveal mb-8">
        <nav className="mb-3 flex text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          <Link href="/" className="cursor-pointer transition hover:text-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/menu" className="cursor-pointer transition hover:text-primary">
            Menu
          </Link>
          <span className="mx-2">/</span>
          <span className="text-primary">Cart</span>
        </nav>

        <div className="relative overflow-hidden rounded-3xl border border-accent/40 bg-linear-to-r from-primary via-primary-hover to-primary p-6 text-white shadow-xl sm:p-10">
          <div className="absolute bottom-0 right-0 translate-x-10 translate-y-10 text-[170px] opacity-10">🛍</div>
          <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="inline-flex rounded-full border border-white/20 bg-accent px-3 py-1 text-xs font-black uppercase tracking-widest text-foreground">
                Premium Dining Cart
              </span>
              <h1 className="font-bengali mt-4 text-3xl font-black sm:text-4xl">আপনার শপিং ব্যাগ (Your Cart)</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">
                Review quantities, variants, add-ons, coupon savings, VAT, delivery charge, and final payable amount.
              </p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-wider text-white/70">Cart Items</p>
              <p className="text-3xl font-black text-accent">{cartCount}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid items-start gap-8 lg:grid-cols-12">
        <section className="space-y-5 lg:col-span-8">
          {cartItems.map((item) => {
            const addOnTotal = item.addOns.reduce((total, addOn) => total + addOn.price, 0)
            const lineTotal = calculateLineTotal(item)

            return (
              <article
                key={item.id}
                className="motion-soft-hover rounded-3xl border border-border bg-card p-5 shadow-sm hover:shadow-lg"
              >
                <div className="grid gap-5 sm:grid-cols-[120px_1fr]">
                  <div className="flex h-32 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-accent/15 to-primary/10">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-6xl">{item.emoji ?? "🍽"}</span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <span className="rounded-full bg-primary-soft px-3 py-1 text-[10px] font-black uppercase tracking-wider text-primary">
                          {item.category}
                        </span>
                        <h2 className="font-bengali mt-3 text-xl font-black leading-tight">{item.name}</h2>
                        {item.variant && (
                          <p className="mt-1 text-xs font-bold text-muted-foreground">Variant: {item.variant}</p>
                        )}
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex cursor-pointer items-center gap-1 self-start text-xs font-black text-primary transition hover:underline"
                      >
                        <Trash2 className="size-4" />
                        Remove
                      </button>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div className="rounded-2xl border border-border bg-background p-3">
                        <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Add-ons</p>
                        {item.addOns.length > 0 ? (
                          <div className="mt-2 space-y-1">
                            {item.addOns.map((addOn) => (
                              <div key={addOn.name} className="flex justify-between text-xs font-semibold">
                                <span>{addOn.name}</span>
                                <span className="text-primary">+{formatCurrency(addOn.price)}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="mt-2 text-xs text-muted-foreground">No add-ons selected</p>
                        )}
                      </div>

                      <div className="rounded-2xl border border-border bg-background p-3">
                        <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                          Order Note
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">{item.note || "No special note added."}</p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-4 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-sm">
                        <p className="text-muted-foreground">
                          Unit {formatCurrency(item.unitPrice)} + Add-ons {formatCurrency(addOnTotal)}
                        </p>
                        <p className="mt-1 text-2xl font-black text-primary">{formatCurrency(lineTotal)}</p>
                      </div>

                      <div className="flex w-fit items-center rounded-full border border-border bg-background p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex size-9 cursor-pointer items-center justify-center rounded-full text-primary transition hover:bg-muted"
                          aria-label={`Decrease ${item.name} quantity`}
                        >
                          <Minus className="size-4" />
                        </button>
                        <span className="w-10 text-center text-sm font-black">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex size-9 cursor-pointer items-center justify-center rounded-full text-primary transition hover:bg-muted"
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          <Plus className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </section>

        <aside className="sticky top-24 space-y-6 rounded-3xl border border-border bg-card p-6 shadow-md lg:col-span-4">
          <div className="border-b border-border pb-4">
            <h2 className="font-bengali flex items-center gap-2 text-xl font-black">
              <ShoppingBag className="size-5 text-primary" />
              অর্ডার সামারি
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">Coupon, VAT, delivery, and final payable amount.</p>
          </div>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-muted-foreground">
              <BadgePercent className="size-4 text-accent" />
              Coupon Code
            </span>
            {appliedCoupon ? (
              <div className="flex items-center justify-between rounded-2xl border border-success/30 bg-success-soft px-4 py-3">
                <div>
                  <p className="text-xs font-black text-success">{appliedCoupon.code} applied</p>
                  <p className="text-xs text-muted-foreground">-{formatCurrency(appliedCoupon.discount)} discount</p>
                </div>
                <button
                  onClick={() => useCartStore.getState().clearDiscount()}
                  className="cursor-pointer text-xs font-black text-destructive hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value)}
                  className="h-11 min-w-0 flex-1 rounded-2xl border border-border bg-background px-4 text-sm font-bold outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
                  placeholder="Enter coupon code"
                />
                <Button className="rounded-2xl border border-accent/40">Apply</Button>
              </div>
            )}
            {!appliedCoupon && (
              <p className="mt-2 text-xs text-muted-foreground">Demo discount (10%) is applied automatically.</p>
            )}
          </label>

          <div className="space-y-3 border-t border-border pt-4 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Cart Subtotal</span>
              <span className="font-extrabold text-foreground">{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between text-success">
              <span>{appliedCoupon ? `Coupon (${appliedCoupon.code})` : "Discount (10%)"}</span>
              <span className="font-extrabold">-{formatCurrency(totals.discount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Govt VAT (5%)</span>
              <span className="font-extrabold text-foreground">{formatCurrency(totals.vat)}</span>
            </div>
            <div className="flex justify-between">
              <span>Premium Delivery Charge</span>
              <span className="font-extrabold text-foreground">
                {isFreeDelivery ? <span className="text-success">FREE</span> : formatCurrency(deliveryFee)}
              </span>
            </div>
            {freeDeliveryMin > 0 && !isFreeDelivery && (
              <p className="text-xs text-muted-foreground">
                Add ৳{(freeDeliveryMin - totals.subtotal).toFixed(0)} more for free delivery
              </p>
            )}
            <div className="flex justify-between border-t border-border pt-4 text-base font-black text-foreground">
              <span>Grand Total Due</span>
              <span className="text-2xl text-primary">{formatCurrency(totals.total)}</span>
            </div>
          </div>

          <Button
            asChild
            className="w-full rounded-2xl border border-accent/40 py-6 font-black shadow-lg shadow-primary/20"
          >
            <Link href="/checkout">
              Proceed to Checkout
              <ArrowRight />
            </Link>
          </Button>

          <Button asChild variant="outline" className="w-full rounded-2xl border-border py-6 font-bold">
            <Link href="/menu">
              <Utensils />
              Add More Items
            </Link>
          </Button>
        </aside>
      </div>
    </div>
  )
}

export default CartPageContent
