import type { DashboardStat, FeaturedDish, HomeServiceStat, NavItem, OrderStep, Review } from "@/types/home.interface"

export const publicNavItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Reservations", href: "/reservation" },
  { label: "Track Order", href: "/order-tracking" },
]

export const featuredDishes: FeaturedDish[] = [
  {
    name: "Royal Mutton Kacchi",
    category: "Biryani",
    price: "৳420",
    description: "Fragrant chinigura rice, tender mutton, potato, and house spice blend.",
    badge: "Best Seller",
    emoji: "🍛",
    rating: "4.9",
  },
  {
    name: "Shorshe Ilish",
    category: "Fish",
    price: "৳520",
    description: "Hilsa cooked in mustard, green chili, and slow-steamed Bengali gravy.",
    badge: "Signature",
    emoji: "🐟",
    rating: "4.8",
  },
  {
    name: "Chicken Roast Combo",
    category: "Combo",
    price: "৳360",
    description: "Classic roast chicken with polao, salad, borhani, and dessert.",
    badge: "Popular",
    emoji: "🍗",
    rating: "4.7",
  },
  {
    name: "Borhani & Firni Set",
    category: "Dessert",
    price: "৳180",
    description: "A classic sweet and tangy finish for royal Bengali meals.",
    badge: "Combo",
    emoji: "🥤",
    rating: "4.8",
  },
]

export const homeServiceStats: HomeServiceStat[] = [
  {
    title: "হালাল",
    value: "১০০%",
    description: "Halal Certified Ingredients",
  },
  {
    title: "Delivery",
    value: "45 Mins",
    description: "Fastest Home Delivery",
  },
  {
    title: "Rating",
    value: "4.9 Star",
    description: "From 5000+ Foodies",
  },
]

export const orderSteps: OrderStep[] = [
  {
    title: "Select Your Food",
    text: "Browse our categorized premium dishes and customize your variants.",
    tone: "gold",
  },
  {
    title: "Secure Online Payment",
    text: "Pay using bKash, Nagad, Cards or cash on delivery securely through checkout.",
    tone: "red",
  },
  {
    title: "Hot Delivery",
    text: "Track your order in real-time until our kitchen prepares and delivers it hot.",
    tone: "green",
  },
]

export const dashboardStats: DashboardStat[] = [
  { label: "Today Sales", value: "৳48.5k" },
  { label: "Live Orders", value: "18" },
  { label: "Reservations", value: "12" },
  { label: "Menu Items", value: "86" },
]

export const liveOrderPreview = ["#AH-8762 Preparing", "#AH-8763 Pending", "#AH-8764 Out for delivery"]

export const guestReviews: Review[] = [
  {
    name: "Zubair Hasan",
    role: "Verified Food Lover",
    initials: "ZH",
    text: "The Mutton Kacchi Biryani from Ahar is absolutely royal. The aroma is genuine and delivery was excellent.",
  },
  {
    name: "Nusrat Amin",
    role: "Reservation Guest",
    initials: "NA",
    text: "Super responsive reservation system and beautiful table arrangement. Perfect for family dinner.",
  },
  {
    name: "Sajjad Islam",
    role: "Regular Customer",
    initials: "SI",
    text: "The combo offers are great value, and tracking the order made the whole experience smooth.",
  },
]
