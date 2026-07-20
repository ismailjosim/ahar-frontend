"use client"

import Image from "next/image"
import { Calendar, Clock, Flame, LayoutGrid, Star, Sparkles, CheckCircle2, AlertTriangle } from "lucide-react"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { MenuItem } from "@/types/menu.interface"
import { formatCurrency } from "@/lib/cart.utils"

interface MenuViewDetailsDialogProps {
  open: boolean
  onClose: () => void
  menuItem: MenuItem | null
}

const MenuViewDetailsDialog = ({ open, onClose, menuItem }: MenuViewDetailsDialogProps) => {
  if (!menuItem) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[92vh] flex flex-col p-0 overflow-hidden bg-card border border-border">
        {/* Modal Header Shell */}
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold tracking-tight text-card-foreground">Menu Item Details</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            View complete configuration, metadata arrays, and options about this item.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Canvas Section to avoid screen overflow */}
        <ScrollArea className="flex-1 px-6 pb-6 overflow-y-auto">
          <div className="space-y-6">
            {/* 1. Enhanced Image Presentation Container */}
            <div className="relative w-full h-56 md:h-64 bg-muted rounded-xl border border-border/80 overflow-hidden flex items-center justify-center group">
              {menuItem.imageUrl ? (
                <Image
                  src={menuItem.imageUrl}
                  alt={menuItem.name}
                  fill
                  className="object-cover object-center group-hover:scale-102 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 650px"
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground/50 select-none">
                  <span className="text-5xl">🍔</span>
                  <span className="text-xs font-semibold">No Preview Image Added</span>
                </div>
              )}
            </div>

            {/* 2. Primary Layout Specifications Grid */}
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 bg-muted/30 dark:bg-muted/10 p-4 rounded-xl border border-border/40">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Item Name
                </span>
                <p className="font-bold text-sm text-card-foreground line-clamp-1">{menuItem.name}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Category
                </span>
                <p className="font-semibold text-sm text-card-foreground flex items-center gap-1">
                  <LayoutGrid className="w-3.5 h-3.5 text-primary shrink-0" />
                  {/* Fixed: Safely accessing name property on the category relation object */}
                  {menuItem.category?.name || "N/A"}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Base Price
                </span>
                <p className="font-extrabold text-sm text-primary">{formatCurrency(menuItem.price)}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Live Rating
                </span>
                <p className="font-semibold text-sm text-card-foreground flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500 shrink-0" />
                  {menuItem.rating ? `${menuItem.rating.toFixed(1)} / 5.0` : "No rating yet"}
                </p>
              </div>

              {menuItem.prepTime && (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Preparation Speed
                  </span>
                  <p className="font-semibold text-sm text-card-foreground flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    {menuItem.prepTime}
                  </p>
                </div>
              )}
            </div>

            {/* 3. Narrative Description Block */}
            {menuItem.description && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Product Narrative</h4>
                <p className="text-xs text-card-foreground/90 whitespace-pre-wrap leading-relaxed bg-card p-3 rounded-lg border border-border/60">
                  {menuItem.description}
                </p>
              </div>
            )}

            {/* 4. Live Operational Status Badges */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                System Profile Badges
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {menuItem.isFeatured && (
                  <Badge
                    variant="default"
                    className="bg-amber-500 text-black font-bold gap-1 text-[10px] hover:bg-amber-500"
                  >
                    <Sparkles className="w-3 h-3 fill-black" /> Featured Profile
                  </Badge>
                )}
                {menuItem.isSpicy && (
                  <Badge variant="destructive" className="font-bold gap-1 text-[10px]">
                    <Flame className="w-3 h-3 fill-current" /> Spicy Flag
                  </Badge>
                )}
                {menuItem.isAvailable ? (
                  <Badge
                    variant="secondary"
                    className="bg-emerald-600 hover:bg-emerald-600 text-white font-bold gap-1 text-[10px]"
                  >
                    <CheckCircle2 className="w-3 h-3" /> Available in Stores
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-destructive text-destructive bg-destructive/10 font-bold gap-1 text-[10px]"
                  >
                    <AlertTriangle className="w-3 h-3" /> Out of Stock Order Block
                  </Badge>
                )}
              </div>
            </div>

            {/* 5. Complete Meta Tags Grid */}
            {menuItem.tags && menuItem.tags.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Search Keywords / Tags
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {menuItem.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-[11px] px-2.5 py-0.5 bg-background font-medium text-muted-foreground"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Variants Array Block */}
            {menuItem.variants && menuItem.variants.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Sizing Profiles & Variants
                </h4>
                <div className="grid gap-2 sm:grid-cols-2">
                  {menuItem.variants.map((variant, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-border bg-background p-3 shadow-xs hover:border-primary/30 transition-colors"
                    >
                      <span className="font-semibold text-xs text-card-foreground">{variant.name}</span>
                      {/* Fixed: Target variant.price parameter value cleanly inside formatter */}
                      <span className="text-xs font-bold text-primary">{formatCurrency(variant.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. Add-ons Array Block */}
            {menuItem.addOns && menuItem.addOns.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Optional Accompaniments / Add-ons
                </h4>
                <div className="grid gap-2 sm:grid-cols-2">
                  {menuItem.addOns.map((addOn, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-border bg-background p-3 shadow-xs hover:border-primary/30 transition-colors"
                    >
                      <span className="font-semibold text-xs text-card-foreground">{addOn.name}</span>
                      <span className="text-xs font-bold text-emerald-600">+{formatCurrency(addOn.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator className="bg-border/60" />

            {/* 8. Immutable Tracking Timestamps */}
            <div className="grid gap-4 grid-cols-2 text-muted-foreground">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider block">System Creation Timestamp</span>
                <p className="font-medium text-[11px] flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(menuItem.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider block">Database Last Mutated</span>
                <p className="font-medium text-[11px] flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(menuItem.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default MenuViewDetailsDialog
