"use client"

import { ShoppingCart, Receipt, Minus, Plus, Trash2 } from "lucide-react"
import { MenuItem } from "@/types/menu.interface"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"

//* Define a structured type for the items within the cart array
export interface CartItem {
  item: MenuItem
  qty: number
}

interface CartBoxProps {
  cart: CartItem[]
  totalQty: number
  subtotal: number
  vatCharge: number
  serviceCharge: number
  grandTotal: number
  removeFromCart: (id: string) => void
  addToCart: (item: MenuItem) => void
  clearCart: () => void
}

const CartBox = ({
  cart,
  totalQty,
  subtotal,
  vatCharge,
  serviceCharge,
  grandTotal,
  removeFromCart,
  addToCart,
  clearCart,
}: CartBoxProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="default" size="icon" className="relative shrink-0 cursor-pointer">
          <ShoppingCart className="w-4 h-4" />
          {totalQty > 0 && (
            <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold animate-in zoom-in-50">
              {totalQty}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-sm flex flex-col h-full bg-card">
        <SheetHeader className="border-b pb-3">
          <SheetTitle className="flex items-center gap-2 text-primary uppercase text-sm font-bold tracking-wider">
            <Receipt className="w-4 h-4 text-amber-500" /> Your Order Selection ({totalQty})
          </SheetTitle>
        </SheetHeader>

        {/* Dynamic Cart Items List */}
        <div className="flex-1 overflow-y-auto py-2 divide-y divide-border/60 text-sm">
          {cart.length === 0 ? (
            <div className="text-center text-muted-foreground py-12 flex flex-col items-center justify-center gap-2">
              <span className="text-3xl select-none">🛒</span>
              <p className="text-xs">No items selected yet.</p>
            </div>
          ) : (
            cart.map(({ item, qty }) => (
              <div key={item.id} className="flex justify-between items-center py-3 animate-in fade-in-50">
                <div className="grow pr-2">
                  <p className="font-bold text-xs text-card-foreground line-clamp-1">{item.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    ৳{item.price.toLocaleString("en-IN")} x {qty}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-6 h-6 rounded-full cursor-pointer"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="text-xs font-bold w-4 text-center select-none">{qty}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-6 h-6 rounded-full cursor-pointer"
                    onClick={() => addToCart(item)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout Summary Footer */}
        <div className="border-t pt-4 space-y-2 text-xs bg-muted/20 p-3 rounded-xl">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal:</span>
            <span>৳{subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Est. VAT (15%):</span>
            <span>৳{vatCharge.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Service (10%):</span>
            <span>৳{serviceCharge.toLocaleString("en-IN")}</span>
          </div>

          <div className="flex justify-between font-bold text-sm pt-2.5 border-t border-dashed border-border">
            <span>Grand Total:</span>
            <span className="text-primary font-extrabold text-base">৳{grandTotal.toLocaleString("en-IN")}</span>
          </div>

          <SheetClose asChild>
            <Button
              className="w-full mt-3 h-10 font-bold uppercase tracking-wide cursor-pointer"
              disabled={totalQty === 0}
            >
              Submit Order to Waiter
            </Button>
          </SheetClose>

          <Button
            variant="ghost"
            className="w-full text-[10px] uppercase font-bold text-muted-foreground hover:text-destructive h-8 gap-1 cursor-pointer"
            onClick={clearCart}
            disabled={totalQty === 0}
          >
            <Trash2 className="w-3 h-3" /> Clear Selection
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default CartBox
