import Image from "next/image"
import { Star, Clock, Flame, Sparkles, ShoppingBag } from "lucide-react"
import { MenuItem } from "@/types/menu.interface"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface MenuCardProps {
  menuItem: MenuItem
  // Fixed: Updated signature to accept both the item and the quantity
  addToCart: (item: MenuItem, qty: number) => void
}

const MenuCard = ({ menuItem, addToCart }: MenuCardProps) => {
  const { name, description, price, imageUrl, rating, prepTime, tags, isFeatured, isSpicy, isAvailable } =
    menuItem || {}

  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col justify-between shadow-sm hover:-translate-y-1 transition-transform relative group">
      <div>
        {/* Card Media Wrapper */}
        <div className="h-40 w-full bg-secondary rounded-lg flex items-center justify-center mb-3 relative overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              priority={isFeatured}
            />
          ) : (
            <span className="text-4xl text-muted-foreground/40 select-none">🍔</span>
          )}

          {/* Absolute Status Badges */}
          <div className="absolute top-2 left-2 flex gap-1 flex-wrap z-10">
            {isFeatured && (
              <Badge
                variant="default"
                className="text-[10px] bg-amber-500 hover:bg-amber-600 text-black font-bold gap-1 px-2 py-0.5"
              >
                <Sparkles className="w-3 h-3 fill-black" /> Featured
              </Badge>
            )}
            {isSpicy && (
              <Badge variant="destructive" className="text-[10px] font-bold gap-1 px-2 py-0.5">
                <Flame className="w-3 h-3 fill-current" /> Spicy
              </Badge>
            )}
            {!isAvailable && (
              <Badge
                variant="outline"
                className="text-[10px] bg-background/90 text-destructive border-destructive font-bold px-2 py-0.5"
              >
                Sold Out
              </Badge>
            )}
          </div>
        </div>

        {/* Info Header Alignment */}
        <div className="flex justify-between items-start gap-2 mb-1">
          <h4 className="font-bold text-base leading-tight text-card-foreground group-hover:text-primary transition-colors line-clamp-1">
            {name}
          </h4>
          <span className="text-primary font-extrabold text-sm whitespace-nowrap">
            ৳{price.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Dynamic Tag Row */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.slice(0, 2).map((tag, idx) => (
              <span key={idx} className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Meta Info Indicators */}
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-medium mb-2">
          <span className="text-amber-500 font-bold flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" /> {rating?.toFixed(1)}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {prepTime}
          </span>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{description}</p>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
          {isAvailable ? "Available" : "Unavailable"}
        </span>
        <Button
          size="sm"
          disabled={!isAvailable}
          // Fixed: Explicitly passed the required quantity parameter (1) to match parent's expectations
          onClick={() => addToCart(menuItem, 1)}
          className="text-xs h-8 px-3 gap-1.5 shadow-sm font-semibold cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5" /> Add To Tray
        </Button>
      </div>
    </div>
  )
}

export default MenuCard
