"use client"
import { useState, useMemo } from "react"
import { Leaf, Flame, Crown, X, Utensils } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

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

const MenuFilterOptions = () => {
  /*
      * 1. if add any filter those will be added into params like this
      ?category=starters&sort=price-low&maxPrice=500&veg=true&spicy=true&special=true
  */

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
    <aside className="w-full lg:w-64 bg-card border rounded-xl p-5 shadow-sm sticky top-24 z-10 hidden lg:block">
      <div className="flex items-center justify-between pb-4 border-b mb-4">
        <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2">Filters</h3>
        <Button
          variant="link"
          size="sm"
          onClick={() => {
            setFilters({ veg: false, spicy: false, special: false })
            setMaxPrice([1000])
            setSortOption("relevance")
          }}
          className="text-xs h-auto p-0"
        >
          Reset All
        </Button>
      </div>

      {/* Sort By[cite: 1] */}
      <div className="mb-6">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Sort by</h4>
        <RadioGroup value={sortOption} onValueChange={setSortOption} className="space-y-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="relevance" id="r1" />
            <Label htmlFor="r1" className="text-xs">
              Relevance
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="price-low" id="r2" />
            <Label htmlFor="r2" className="text-xs">
              Price: Low to High
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="price-high" id="r3" />
            <Label htmlFor="r3" className="text-xs">
              Price: High to Low
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="rating" id="r4" />
            <Label htmlFor="r4" className="text-xs">
              Top Rated ⭐
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Dietary Filters[cite: 1] */}
      <div className="mb-6">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Dietary Choices</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="veg" checked={filters.veg} onCheckedChange={(c) => setFilters((p) => ({ ...p, veg: !!c }))} />
            <Label htmlFor="veg" className="text-xs flex items-center gap-1">
              <Leaf className="w-3 h-3 text-emerald-600" /> Vegetarian
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="spicy"
              checked={filters.spicy}
              onCheckedChange={(c) => setFilters((p) => ({ ...p, spicy: !!c }))}
            />
            <Label htmlFor="spicy" className="text-xs flex items-center gap-1">
              <Flame className="w-3 h-3 text-red-600" /> Spicy Delicacies
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="special"
              checked={filters.special}
              onCheckedChange={(c) => setFilters((p) => ({ ...p, special: !!c }))}
            />
            <Label htmlFor="special" className="text-xs flex items-center gap-1">
              <Crown className="w-3 h-3 text-amber-500" /> Chef's Signatures
            </Label>
          </div>
        </div>
      </div>

      {/* Price Slider[cite: 1] */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Max Price</h4>
          <span className="text-xs font-extrabold text-primary">৳{maxPrice[0]}</span>
        </div>
        <Slider value={maxPrice} onValueChange={setMaxPrice} max={1000} min={100} step={50} className="w-full" />
      </div>
    </aside>
  )
}

export default MenuFilterOptions
