"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Clock3, FilterX, Search, ShoppingBag, SlidersHorizontal, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { defaultMenuPriceLimit, menuCategories, menuItems } from "@/lib/menu.constant"
import { cn } from "@/lib/utils"
import type { MenuCartItem, MenuItem, MenuSortOption } from "@/types/menu.interface"

const formatCurrency = (amount: number) => `৳${amount}`

const MenuCatalog = () => {
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<MenuSortOption>("default")
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [spicyOnly, setSpicyOnly] = useState(false)
  const [availableOnly, setAvailableOnly] = useState(false)
  const [priceLimit, setPriceLimit] = useState(defaultMenuPriceLimit)
  const [cartItems, setCartItems] = useState<MenuCartItem[]>([])

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    const nextItems = menuItems.filter((item) => {
      const matchesCategory = activeCategory === "all" || item.category === activeCategory
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [item.name, item.description, item.category, ...item.tags].some((value) =>
          value.toLowerCase().includes(normalizedSearch),
        )
      const matchesFeatured = !featuredOnly || item.isFeatured
      const matchesSpicy = !spicyOnly || item.isSpicy
      const matchesAvailable = !availableOnly || item.isAvailable
      const matchesPrice = item.price <= priceLimit

      return matchesCategory && matchesSearch && matchesFeatured && matchesSpicy && matchesAvailable && matchesPrice
    })

    return [...nextItems].sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price
      if (sortBy === "price-high") return b.price - a.price
      if (sortBy === "rating") return b.rating - a.rating
      return Number(b.isFeatured) - Number(a.isFeatured) || b.rating - a.rating
    })
  }, [activeCategory, availableOnly, featuredOnly, priceLimit, searchTerm, sortBy, spicyOnly])

  const cartSubtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const discount = Math.round(cartSubtotal * 0.1)
  const vat = Math.round(cartSubtotal * 0.05)
  const deliveryCharge = cartSubtotal > 0 ? 60 : 0
  const grandTotal = cartSubtotal - discount + vat + deliveryCharge
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const addToCart = (item: MenuItem) => {
    if (!item.isAvailable) return

    setCartItems((currentItems) => {
      const existingItem = currentItems.find((cartItem) => cartItem.id === item.id)

      if (existingItem) {
        return currentItems.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
      }

      return [...currentItems, { id: item.id, name: item.name, price: item.price, quantity: 1 }]
    })
  }

  const removeFromCart = (id: string) => {
    setCartItems((currentItems) => currentItems.filter((item) => item.id !== id))
  }

  const resetFilters = () => {
    setActiveCategory("all")
    setSearchTerm("")
    setSortBy("default")
    setFeaturedOnly(false)
    setSpicyOnly(false)
    setAvailableOnly(false)
    setPriceLimit(defaultMenuPriceLimit)
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="motion-reveal motion-shimmer relative mb-10 overflow-hidden rounded-3xl border border-accent/40 bg-linear-to-r from-primary via-primary-hover to-primary p-6 text-white shadow-xl sm:p-10">
        <div className="absolute bottom-0 right-0 translate-x-10 translate-y-10 text-[180px] opacity-10 sm:text-[220px]">
          🍲
        </div>
        <div className="relative z-10 max-w-xl space-y-4">
          <span className="inline-flex rounded-full border border-white/20 bg-accent px-3 py-1 text-xs font-black uppercase tracking-widest text-foreground">
            শাহী স্বাদ ও ঐতিহ্য
          </span>
          <h1 className="font-bengali text-3xl font-extrabold leading-tight sm:text-4xl">
            আহার মেনু তালিকা (Traditional Menu List)
          </h1>
          <p className="text-sm leading-relaxed text-white/80">
            Explore authentic slow-cooked Kacchi Biryanis, sizzling Kebabs, royal desserts, and cooling traditional
            drinks. Freshly prepared to deliver royalty directly to your table.
          </p>
        </div>
      </section>

      <section className="motion-reveal motion-reveal-delay-1 mb-8 space-y-6 rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12">
          <label className="relative md:col-span-5">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search delicious food... (যেমন: কাচ্চি, কাবাব, বোরহানি)"
              className="h-12 w-full rounded-2xl border border-border bg-secondary/50 pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </label>

          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as MenuSortOption)}
              className="h-12 w-full cursor-pointer rounded-2xl border border-border bg-secondary/50 px-4 text-sm font-bold text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
            >
              <option value="default">Sort by: Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating: Top Rated</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-bold md:col-span-4 md:justify-end">
            {[
              { label: "★ Featured Only", checked: featuredOnly, onChange: setFeaturedOnly },
              { label: "🌶 Spicy Only", checked: spicyOnly, onChange: setSpicyOnly },
              { label: "✓ In Stock", checked: availableOnly, onChange: setAvailableOnly },
            ].map((filter) => (
              <label
                key={filter.label}
                className="flex cursor-pointer items-center gap-2 transition hover:text-primary"
              >
                <input
                  type="checkbox"
                  checked={filter.checked}
                  onChange={(event) => filter.onChange(event.target.checked)}
                  className="size-4 cursor-pointer accent-primary"
                />
                <span>{filter.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-border/40 pt-4 sm:flex-row sm:items-center">
          <label className="w-full max-w-md space-y-2">
            <div className="flex justify-between text-xs font-extrabold text-muted-foreground">
              <span>Price Range (BDT)</span>
              <span>Max Limit: {formatCurrency(priceLimit)}</span>
            </div>
            <input
              type="range"
              min="40"
              max={defaultMenuPriceLimit}
              value={priceLimit}
              onChange={(event) => setPriceLimit(Number(event.target.value))}
              className="h-2 w-full cursor-pointer accent-primary"
            />
          </label>
          <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
            <SlidersHorizontal className="size-4 text-accent" />
            Showing <span className="font-black text-primary">{filteredItems.length}</span> out of{" "}
            <span className="font-black">{menuItems.length}</span> traditional delicacies
          </div>
        </div>
      </section>

      <div className="-mx-4 mb-8 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
        <div className="flex min-w-max items-center gap-2 border-b border-border/40 pb-2">
          {menuCategories.map((category) => (
            <button
              key={category.slug}
              onClick={() => setActiveCategory(category.slug === "all" ? "all" : category.name)}
              className={cn(
                "cursor-pointer rounded-full border px-6 py-3 text-xs font-black transition duration-200",
                (activeCategory === "all" && category.slug === "all") || activeCategory === category.name
                  ? "border-accent bg-primary text-white shadow-md shadow-primary/20"
                  : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary",
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <section className="space-y-6 lg:col-span-8">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((item) => (
                <article
                  key={item.id}
                  className={cn(
                    "motion-soft-hover group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm hover:shadow-lg",
                    !item.isAvailable && "opacity-70",
                  )}
                >
                  <div className="relative flex h-44 items-center justify-center bg-linear-to-br from-accent/15 to-primary/10">
                    <span className="text-7xl transition duration-300 group-hover:scale-110">{item.emoji}</span>
                    <div className="absolute left-3 top-3 flex flex-wrap gap-1">
                      {item.isFeatured && (
                        <span className="rounded-full border border-white/40 bg-accent px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-foreground">
                          Featured
                        </span>
                      )}
                      {item.isSpicy && (
                        <span className="rounded-full border border-accent/40 bg-primary px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white">
                          Spicy
                        </span>
                      )}
                    </div>
                    {!item.isAvailable && (
                      <span className="absolute bottom-3 rounded-full bg-destructive px-3 py-1 text-xs font-black uppercase text-white">
                        Out of stock
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                        {item.category}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-extrabold text-muted-foreground">
                        <Clock3 className="size-3" />
                        {item.prepTime}
                      </span>
                    </div>
                    <h2 className="font-bengali text-base font-extrabold leading-snug text-foreground">{item.name}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                    <div className="mt-3 flex items-center gap-1 text-accent">
                      <Star className="size-4 fill-current" />
                      <span className="text-xs font-bold">{item.rating.toFixed(1)}</span>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-5">
                      <div>
                        <span className="block text-[9px] font-bold uppercase text-muted-foreground">Base Price</span>
                        <span className="text-xl font-black text-primary">{formatCurrency(item.price)}</span>
                      </div>
                      <Button
                        onClick={() => addToCart(item)}
                        disabled={!item.isAvailable}
                        className="motion-scale-hover rounded-full border border-accent/40"
                      >
                        <ShoppingBag />
                        Add
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-border bg-card p-12 text-center shadow-sm">
              <span className="block text-6xl">🍽</span>
              <h2 className="mt-4 text-xl font-bold">No Dishes Match Your Selection</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                Try adjusting your search criteria, clearing checkboxes, or expanding your price slider.
              </p>
              <Button onClick={resetFilters} className="mt-5 rounded-full border border-accent/40">
                <FilterX />
                Clear Filters & Search
              </Button>
            </div>
          )}
        </section>

        <aside className="sticky top-24 hidden max-h-[calc(100vh-120px)] space-y-6 overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-md lg:col-span-4 lg:block">
          <div className="flex items-center justify-between border-b border-border/50 pb-4">
            <h2 className="font-bengali flex items-center gap-2 text-lg font-black text-foreground">
              <ShoppingBag className="size-5 text-primary" />
              শপিং ব্যাগ (Your Cart)
            </h2>
            <span className="rounded-full border border-accent bg-primary px-2.5 py-0.5 text-[11px] font-black text-white">
              {cartCount}
            </span>
          </div>

          <div className="max-h-70 space-y-4 overflow-y-auto pr-1">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.id} className="rounded-2xl border border-border bg-background p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold leading-tight">{item.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Qty: {item.quantity} x {formatCurrency(item.price)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="cursor-pointer text-xs font-black text-primary hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-6 text-center">
                <ShoppingBag className="mx-auto mb-3 size-8 text-accent" />
                <p className="text-sm font-bold">Your shopping bag is empty</p>
                <p className="mt-1 text-xs text-muted-foreground">Add dishes to see the checkout summary.</p>
              </div>
            )}
          </div>

          <div className="space-y-2 border-t border-border/50 pt-4 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-extrabold text-foreground">{formatCurrency(cartSubtotal)}</span>
            </div>
            <div className="flex justify-between text-success">
              <span>Discount (10% Applied)</span>
              <span className="font-extrabold">-{formatCurrency(discount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Govt VAT (5%)</span>
              <span className="font-extrabold text-foreground">{formatCurrency(vat)}</span>
            </div>
            <div className="flex justify-between">
              <span>Home Delivery Charge</span>
              <span className="font-extrabold text-foreground">{formatCurrency(deliveryCharge)}</span>
            </div>
            <div className="flex justify-between border-t border-border/40 pt-3 text-base font-black text-foreground">
              <span>Grand Total Due</span>
              <span className="text-xl text-primary">{formatCurrency(grandTotal)}</span>
            </div>
          </div>

          <Button
            asChild
            className="w-full rounded-2xl border border-accent/40 py-6 font-bold shadow-lg shadow-primary/20"
          >
            <Link href="/checkout">
              <ShoppingBag />
              Proceed to Order Checkout
            </Link>
          </Button>
        </aside>
      </div>

      <div className="fixed inset-x-4 bottom-4 z-30 rounded-3xl border border-accent bg-card p-4 shadow-2xl lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-muted-foreground">Cart Summary</p>
            <p className="text-lg font-black text-primary">
              {cartCount} items • {formatCurrency(grandTotal)}
            </p>
          </div>
          <Button asChild className="rounded-2xl border border-accent/40">
            <Link href="/checkout">Checkout</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MenuCatalog
