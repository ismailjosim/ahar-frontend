"use client"

import { ShoppingCart, Receipt, Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { useCartStore } from "@/store/cart.store"

const CartBox = () => {
  const { items, updateQuantity, clearCart, getTotals, getItemCount } = useCartStore()
  const totalQty = getItemCount()
  const totals = getTotals()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-8 right-8 z-50 h-14 w-14 rounded-full shadow-2xl hover:scale-105 transition-transform cursor-pointer"
        >
          <ShoppingCart className="w-6 h-6" />
          {totalQty > 0 && (
            <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs w-6 h-6 flex items-center justify-center rounded-full font-bold animate-in zoom-in-50 shadow-sm border border-destructive-foreground/20">
              {totalQty}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md flex flex-col h-full bg-card p-6 border-l shadow-2xl">
        <SheetHeader className="border-b border-border/60 pb-4 mb-2">
          <SheetTitle className="flex items-center gap-2 text-primary uppercase text-sm font-bold tracking-wider">
            <Receipt className="w-5 h-5 text-warning" /> Your Tray ({totalQty})
          </SheetTitle>
        </SheetHeader>

        {/* Dynamic Cart Items List */}
        <div className="flex-1 overflow-y-auto py-2 text-sm px-2 -mx-2 space-y-2">
          {items.length === 0 ? (
            <div className="text-center text-muted-foreground py-12 flex flex-col items-center justify-center gap-3 h-full opacity-60">
              <span className="text-5xl select-none">🛒</span>
              <p className="text-sm font-medium tracking-wide uppercase">Your tray is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-3 animate-in fade-in-50 zoom-in-95 gap-4 bg-muted/20 border border-border/30 rounded-xl hover:bg-muted/40 transition-colors"
              >
                <div className="grow overflow-hidden">
                  <p className="font-bold text-sm text-card-foreground truncate">{item.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 font-medium tracking-wide">
                    ৳{item.unitPrice.toLocaleString("en-IN")} <span className="opacity-50">x</span> {item.quantity}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 shrink-0 bg-background/80 p-1 rounded-full border shadow-sm">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-7 h-7 rounded-full cursor-pointer hover:bg-muted hover:text-destructive transition-colors"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </Button>
                  <span className="text-xs font-bold w-5 text-center select-none">{item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-7 h-7 rounded-full cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout Summary Footer */}
        <div className="border-t border-border/60 pt-5 mt-auto space-y-3 text-sm bg-muted/20 p-5 rounded-2xl shadow-inner">
          <div className="flex justify-between text-muted-foreground font-medium">
            <span>Subtotal:</span>
            <span className="text-foreground">৳{totals.subtotal.toLocaleString("en-IN")}</span>
          </div>
          {totals.discount > 0 && (
            <div className="flex justify-between text-success font-medium">
              <span>Discount:</span>
              <span>-৳{totals.discount.toLocaleString("en-IN")}</span>
            </div>
          )}
          <div className="flex justify-between text-muted-foreground font-medium">
            <span>VAT (5%):</span>
            <span className="text-foreground">৳{totals.vat.toLocaleString("en-IN")}</span>
          </div>
          {totals.deliveryCharge > 0 && (
            <div className="flex justify-between text-muted-foreground font-medium">
              <span>Delivery:</span>
              <span className="text-foreground">৳{totals.deliveryCharge.toLocaleString("en-IN")}</span>
            </div>
          )}

          <div className="flex justify-between font-black text-lg pt-3 border-t border-dashed border-border/80">
            <span>Total:</span>
            <span className="text-primary">৳{totals.total.toLocaleString("en-IN")}</span>
          </div>

          <SheetClose asChild>
            <Button
              className="w-full mt-4 h-12 font-extrabold uppercase tracking-widest cursor-pointer shadow-md hover:shadow-lg transition-all"
              disabled={totalQty === 0}
            >
              Checkout Now
            </Button>
          </SheetClose>

          <Button
            variant="ghost"
            className="w-full text-xs uppercase font-bold text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-10 gap-2 cursor-pointer mt-2 transition-colors"
            onClick={clearCart}
            disabled={totalQty === 0}
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Tray
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default CartBox
