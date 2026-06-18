import { Clock3, MapPin, Menu, PackageCheck, ShoppingBag, Star } from "lucide-react"

import type { DashboardStat, FeaturedDish, HomeServiceStat, NavItem, OrderStep } from "@/types/home.interface"

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
  },
  {
    name: "Shorshe Ilish",
    category: "Fish",
    price: "৳520",
    description: "Hilsa cooked in mustard, green chili, and slow-steamed Bengali gravy.",
    badge: "Signature",
  },
  {
    name: "Chicken Roast Combo",
    category: "Combo",
    price: "৳360",
    description: "Classic roast chicken with polao, salad, borhani, and dessert.",
    badge: "Popular",
  },
]

export const homeServiceStats: HomeServiceStat[] = [
  {
    title: "Open Daily",
    description: "10:00 AM - 11:00 PM",
    icon: Clock3,
  },
  {
    title: "Dhaka Service",
    description: "Delivery and pickup",
    icon: MapPin,
  },
  {
    title: "4.9 Rating",
    description: "Customer favorites",
    icon: Star,
  },
]

export const orderSteps: OrderStep[] = [
  {
    title: "Browse Menu",
    text: "Explore categories, featured dishes, add-ons, and real-time availability.",
    icon: Menu,
  },
  {
    title: "Build Cart",
    text: "Select variants, adjust quantity, apply coupons, and review delivery totals.",
    icon: ShoppingBag,
  },
  {
    title: "Track Live",
    text: "Follow every order from placed to preparing, ready, dispatched, and delivered.",
    icon: PackageCheck,
  },
]

export const dashboardStats: DashboardStat[] = [
  { label: "Today Sales", value: "৳48.5k" },
  { label: "Live Orders", value: "18" },
  { label: "Reservations", value: "12" },
  { label: "Menu Items", value: "86" },
]

export const liveOrderPreview = ["#AH-8762 Preparing", "#AH-8763 Pending", "#AH-8764 Out for delivery"]
