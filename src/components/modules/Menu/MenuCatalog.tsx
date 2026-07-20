"use client"

import React, { useState, useMemo } from "react"
import { Search, Leaf, Flame, Crown, Star, Clock, ShoppingCart, Receipt, Utensils, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import MenuFilterOptions from "./MenuFilterOptions"

// 1. Data Model[cite: 1]
const DISHES = [
  {
    id: 1,
    name: "Gondhoraj Fish Tikka",
    banglaName: "গন্ধরাজ ফিশ টিক্কা",
    category: "starters",
    price: 450,
    rating: 4.9,
    time: "15-20 min",
    isVeg: false,
    isSpicy: false,
    isSpecial: true,
    badge: "Chef's Special",
    description: "Fresh river fish fillets infused with local Gondhoraj lime zest...",
    visual: "🐟",
  },
  {
    id: 2,
    name: "Classic Beetroot Chop",
    banglaName: "বীট চপ",
    category: "starters",
    price: 280,
    rating: 4.7,
    time: "10 min",
    isVeg: true,
    isSpicy: false,
    isSpecial: false,
    badge: "Vegetarian",
    description: "Spiced grated beetroot, potato, and peanuts crusted with golden crumbs...",
    visual: "🥔",
  },
  {
    id: 3,
    name: "Traditional Mochar Chop",
    banglaName: "মোচার চপ",
    category: "starters",
    price: 320,
    rating: 4.8,
    time: "12 min",
    isVeg: true,
    isSpicy: false,
    isSpecial: false,
    badge: "Organic Veg",
    description: "Sweet roasted banana flower croquettes tempered with ginger...",
    visual: "🌿",
  },
  {
    id: 4,
    name: "Grand Royal Chingri Malaikari",
    banglaName: "চিংড়ি মালাইকারি",
    category: "mains",
    price: 890,
    rating: 5.0,
    time: "25 min",
    isVeg: false,
    isSpicy: false,
    isSpecial: true,
    badge: "Best Seller",
    description: "Giant freshwater tiger prawns simmered gently in a fragrant glaze...",
    visual: "🍤",
  },
  {
    id: 5,
    name: "Zemindari Kosha Mangsho",
    banglaName: "জমিদারী কষা মাংস",
    category: "mains",
    price: 680,
    rating: 4.9,
    time: "25 min",
    isVeg: false,
    isSpicy: true,
    isSpecial: false,
    badge: "Spicy",
    description: "Selected premium lamb pieces slow-roasted for hours...",
    visual: "🥩",
  },
  {
    id: 6,
    name: "Shorshe Ilish (Premium Cut)",
    banglaName: "সর্ষে ইলিশ",
    category: "traditional",
    price: 790,
    rating: 4.9,
    time: "20 min",
    isVeg: false,
    isSpicy: true,
    isSpecial: true,
    badge: "Premium",
    description: "The ultimate Bengali comfort delicacy. Fresh premium Hilsa steak...",
    visual: "🐟",
  },
  {
    id: 7,
    name: "Heirloom Dhokar Dalna",
    banglaName: "ধোকার ডালনা",
    category: "traditional",
    price: 340,
    rating: 4.6,
    time: "15 min",
    isVeg: true,
    isSpicy: false,
    isSpecial: false,
    badge: "Heritage",
    description: "Fried diamond-cut Bengal lentil cakes simmered in a light...",
    visual: "🍲",
  },
  {
    id: 8,
    name: "Aloo Potoler Chorchori",
    banglaName: "আলু পটল চচ্চড়ি",
    category: "traditional",
    price: 290,
    rating: 4.5,
    time: "12 min",
    isVeg: true,
    isSpicy: false,
    isSpecial: false,
    badge: "Vegan Choice",
    description: "Classic seasonal pointed gourd and new potato cubes dry-tossed...",
    visual: "🥔",
  },
  {
    id: 9,
    name: "Baked Nolen Gur Sandesh",
    banglaName: "বেকড নলেন গুড় সন্দেশ",
    category: "desserts",
    price: 220,
    rating: 4.9,
    time: "8 min",
    isVeg: true,
    isSpicy: false,
    isSpecial: true,
    badge: "Sweet Highlight",
    description: "Artisanal fresh chhena fudge sweetened with premium winter date...",
    visual: "🍮",
  },
  {
    id: 10,
    name: "Gondhoraj Lebu Ghol",
    banglaName: "গন্ধরাজ লেবু ঘোল",
    category: "beverages",
    price: 140,
    rating: 4.8,
    time: "5 min",
    isVeg: true,
    isSpicy: false,
    isSpecial: false,
    badge: "Refreshing",
    description: "Fragrant chilled buttermilk whipped with sweet cream...",
    visual: "🍹",
  },
]

const CATEGORIES = [
  { id: "all", label: "All Menu", icon: <Utensils className="w-6 h-6" /> },
  { id: "starters", label: "Starters", icon: "🥟" },
  { id: "mains", label: "Mains", icon: "🍛" },
  { id: "traditional", label: "Traditional", icon: "🍤" },
  { id: "desserts", label: "Desserts", icon: "🍮" },
  { id: "beverages", label: "Beverages", icon: "🍹" },
]

export default function MenuCatalog() {
  // 2. State Management
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortOption, setSortOption] = useState("relevance")
  const [maxPrice, setMaxPrice] = useState([1000])
  const [filters, setFilters] = useState({ veg: false, spicy: false, special: false })
  const [cart, setCart] = useState<Record<number, { item: (typeof DISHES)[0]; qty: number }>>({})

  // 3. Derived Data (Filtering & Sorting)[cite: 1]
  const filteredDishes = useMemo(() => {
    let result = DISHES.filter((dish) => {
      if (selectedCategory !== "all" && dish.category !== selectedCategory) return false
      if (searchQuery && !dish.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (dish.price > maxPrice[0]) return false
      if (filters.veg && !dish.isVeg) return false
      if (filters.spicy && !dish.isSpicy) return false
      if (filters.special && !dish.isSpecial) return false
      return true
    })

    if (sortOption === "price-low") result.sort((a, b) => a.price - b.price)
    if (sortOption === "price-high") result.sort((a, b) => b.price - a.price)
    if (sortOption === "rating") result.sort((a, b) => b.rating - a.rating)

    return result
  }, [searchQuery, selectedCategory, sortOption, maxPrice, filters])

  // 4. Cart Handlers
  const addToCart = (dish: (typeof DISHES)[0]) => {
    setCart((prev) => ({
      ...prev,
      [dish.id]: { item: dish, qty: (prev[dish.id]?.qty || 0) + 1 },
    }))
  }

  const removeFromCart = (dishId: number) => {
    setCart((prev) => {
      const newCart = { ...prev }
      if (newCart[dishId].qty > 1) {
        newCart[dishId].qty -= 1
      } else {
        delete newCart[dishId]
      }
      return newCart
    })
  }

  const clearCart = () => setCart({})

  // Cart Calculations[cite: 1]
  const cartItems = Object.values(cart)
  const totalQty = cartItems.reduce((acc, curr) => acc + curr.qty, 0)
  const subtotal = cartItems.reduce((acc, curr) => acc + curr.item.price * curr.qty, 0)
  const vatCharge = Math.round(subtotal * 0.15)
  const serviceCharge = Math.round(subtotal * 0.1)
  const grandTotal = subtotal + vatCharge + serviceCharge

  return (
    <div className="container mx-auto py-6 flex flex-col lg:flex-row gap-6 w-full items-start">
      {/* LEFT SIDEBAR: FILTERS */}
      <MenuFilterOptions />
      {/* RIGHT CONTENT CONTAINER */}
      <main className="grow w-full lg:max-w-[calc(100%-17rem)] flex flex-col gap-6">
        {/* Search & Mobile Sheet Trigger */}
        <div className="flex gap-4 items-center w-full relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search Ahar Bengal delicacies..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {/* Cart Sheet Component[cite: 1] */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="default" size="icon" className="relative shrink-0">
                <ShoppingCart className="w-4 h-4" />
                {totalQty > 0 && (
                  <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    {totalQty}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-sm flex flex-col h-full">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-primary uppercase text-sm">
                  <Receipt className="w-4 h-4" /> Your Order Selection ({totalQty})
                </SheetTitle>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {cartItems.length === 0 ? (
                  <p className="text-center text-muted-foreground text-sm mt-10">No items selected yet.</p>
                ) : (
                  cartItems.map(({ item, qty }) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          ৳{item.price} x {qty}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-6 h-6 rounded-full"
                          onClick={() => removeFromCart(item.id)}
                        >
                          -
                        </Button>
                        <span className="text-sm font-bold">{qty}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-6 h-6 rounded-full"
                          onClick={() => addToCart(item)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Checkout Summary[cite: 1] */}
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal:</span>
                  <span>৳{subtotal}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Est. VAT (15%):</span>
                  <span>৳{vatCharge}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Service (10%):</span>
                  <span>৳{serviceCharge}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t">
                  <span>Grand Total:</span>
                  <span className="text-primary">৳{grandTotal}</span>
                </div>
                <Button className="w-full mt-4" disabled={totalQty === 0}>
                  Submit Order to Waiter
                </Button>
                <Button variant="ghost" className="w-full text-xs" onClick={clearCart} disabled={totalQty === 0}>
                  Clear Selection
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Categories Bubble Row[cite: 1] */}
        <section className="w-full">
          <h3 className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider mb-4">Categories</h3>
          <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="flex flex-col items-center gap-2 group shrink-0"
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center border-2 shadow-sm transition-all duration-300 ${
                    selectedCategory === cat.id
                      ? "bg-primary text-primary-foreground border-primary scale-105"
                      : "bg-card border-border group-hover:scale-105"
                  }`}
                >
                  {typeof cat.icon === "string" ? <span className="text-2xl">{cat.icon}</span> : cat.icon}
                </div>
                <span
                  className={`text-xs font-bold transition-all ${selectedCategory === cat.id ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`}
                >
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Menu Grid[cite: 1] */}
        <section>
          <div className="flex items-center justify-between mb-6 pb-2 border-b">
            <h3 className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">
              {selectedCategory === "all" ? "All Delicacies" : CATEGORIES.find((c) => c.id === selectedCategory)?.label}
            </h3>
            <span className="text-xs text-muted-foreground">{filteredDishes.length} Items</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredDishes.length === 0 ? (
              <div className="col-span-full py-12 text-center text-muted-foreground border rounded-xl">
                <p className="text-sm font-bold">No dishes found matching your filters.</p>
              </div>
            ) : (
              filteredDishes.map((dish) => (
                <div
                  key={dish.id}
                  className="bg-card border rounded-xl p-4 flex flex-col justify-between shadow-sm hover:-translate-y-1 transition-transform relative"
                >
                  <div>
                    <div className="h-32 bg-secondary rounded-lg flex items-center justify-center mb-3 relative overflow-hidden group">
                      <span className="text-6xl select-none transform transition-transform group-hover:scale-110 duration-300">
                        {dish.visual}
                      </span>
                      <div className="absolute bottom-2 left-2 flex gap-1 flex-wrap">
                        {dish.isSpecial && (
                          <Badge variant="default" className="text-[9px] px-1.5 py-0">
                            Signature
                          </Badge>
                        )}
                        {dish.isSpicy && (
                          <Badge variant="destructive" className="text-[9px] px-1.5 py-0">
                            🌶️ Spicy
                          </Badge>
                        )}
                        {dish.isVeg && (
                          <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
                            Veg
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-start gap-2 mb-1">
                      <div>
                        <h4 className="font-bold text-sm leading-tight">{dish.name}</h4>
                        <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">{dish.banglaName}</p>
                      </div>
                      <span className="text-primary font-bold text-sm whitespace-nowrap">৳{dish.price}</span>
                    </div>

                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-2 mb-3">
                      <span className="text-amber-500 font-bold flex items-center gap-1">
                        <Star className="w-3 h-3" /> {dish.rating}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {dish.time}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2">{dish.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {dish.badge}
                    </span>
                    <Button size="sm" onClick={() => addToCart(dish)} className="text-xs h-8 px-3">
                      Add To Tray
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
