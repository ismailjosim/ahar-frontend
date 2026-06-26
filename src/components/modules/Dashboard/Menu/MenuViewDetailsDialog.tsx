import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { MenuItem } from "@/types/menu.interface"
import Image from "next/image"

interface IMenuViewDetailsDialogProps {
  open: boolean
  onClose: () => void
  menuItem?: MenuItem | null
}

// ── Small layout helpers ──────────────────────────────────────────────────────

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-start justify-between gap-4 py-2 border-b border-border last:border-0">
    <span className="text-sm text-muted-foreground shrink-0 w-36">{label}</span>
    <span className="text-sm text-right">{value ?? <span className="text-muted-foreground">—</span>}</span>
  </div>
)

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mt-5 mb-1">{children}</p>
)

const stockMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  in_stock: { label: "In Stock", variant: "default" },
  limited: { label: "Limited", variant: "secondary" },
  out_of_stock: { label: "Out of Stock", variant: "destructive" },
}

// ── Component ─────────────────────────────────────────────────────────────────

const MenuViewDetailsDialog = ({ open, onClose, menuItem }: IMenuViewDetailsDialogProps) => {
  if (!menuItem) return null

  const {
    name,
    slug,
    category,
    description,
    price,
    discountPrice,
    discountPercent,
    imageUrl,
    sortOrder,
    prepTime,
    nutrition,
    isHalal,
    isVegetarian,
    isVegan,
    isGlutenFree,
    isSpicy,
    allergens,
    tags,
    variants,
    addOns,
    stockStatus,
    isFeatured,
    isAvailable,
    createdAt,
    updatedAt,
  } = menuItem

  const stock = stockMap[stockStatus] ?? { label: stockStatus, variant: "secondary" }

  const dietaryFlags = [
    isHalal && "Halal",
    isVegetarian && "Vegetarian",
    isVegan && "Vegan",
    isGlutenFree && "Gluten-Free",
    isSpicy && "Spicy",
  ].filter(Boolean) as string[]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] flex flex-col p-0 sm:max-w-2xl">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Menu Item Details</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {/* ── Hero ──────────────────────────────────────────────────────── */}
          <div className="flex items-start gap-4 mb-2">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={name}
                width={96}
                height={96}
                className="rounded-xl border border-border object-cover shrink-0"
              />
            ) : (
              <div className="size-24 rounded-xl border border-border bg-muted flex items-center justify-center text-xs text-muted-foreground shrink-0">
                No Image
              </div>
            )}

            <div className="space-y-1.5 pt-1">
              <h2 className="text-lg font-semibold leading-tight">{name}</h2>
              <p className="text-sm text-muted-foreground">{category}</p>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant={stock.variant}>{stock.label}</Badge>
                {isFeatured && <Badge variant="default">Featured</Badge>}
                {!isAvailable && <Badge variant="secondary">Unavailable</Badge>}
              </div>
            </div>
          </div>

          {/* ── Core Details ──────────────────────────────────────────────── */}
          <SectionTitle>Core Details</SectionTitle>

          {slug && (
            <Row
              label="Slug"
              value={<code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{slug}</code>}
            />
          )}
          {description && (
            <div className="py-2 border-b border-border">
              <p className="text-sm text-muted-foreground mb-1">Description</p>
              <p className="text-sm">{description}</p>
            </div>
          )}
          <Row label="Sort Order" value={sortOrder} />
          {prepTime && <Row label="Prep Time" value={prepTime} />}

          {/* ── Pricing ───────────────────────────────────────────────────── */}
          <SectionTitle>Pricing</SectionTitle>

          <Row label="Base Price" value={`৳${price}`} />
          {discountPrice && <Row label="Discount Price" value={`৳${discountPrice}`} />}
          {discountPercent && <Row label="Discount Percent" value={`${discountPercent}%`} />}

          {/* ── Nutrition ─────────────────────────────────────────────────── */}
          {nutrition && Object.values(nutrition).some((v) => v !== undefined) && (
            <>
              <SectionTitle>Nutrition</SectionTitle>
              {nutrition.calories !== undefined && <Row label="Calories" value={`${nutrition.calories} kcal`} />}
              {nutrition.protein !== undefined && <Row label="Protein" value={`${nutrition.protein} g`} />}
              {nutrition.carbs !== undefined && <Row label="Carbs" value={`${nutrition.carbs} g`} />}
              {nutrition.fat !== undefined && <Row label="Fat" value={`${nutrition.fat} g`} />}
            </>
          )}

          {/* ── Dietary & Allergens ───────────────────────────────────────── */}
          <SectionTitle>Dietary & Allergens</SectionTitle>

          <Row
            label="Dietary Flags"
            value={
              dietaryFlags.length ? (
                <div className="flex flex-wrap justify-end gap-1">
                  {dietaryFlags.map((f) => (
                    <Badge key={f} variant="secondary">
                      {f}
                    </Badge>
                  ))}
                </div>
              ) : null
            }
          />

          <Row
            label="Allergens"
            value={
              allergens?.length ? (
                <div className="flex flex-wrap justify-end gap-1">
                  {allergens.map((a) => (
                    <Badge key={a} variant="destructive" className="capitalize">
                      {a}
                    </Badge>
                  ))}
                </div>
              ) : null
            }
          />

          {/* ── Variants ──────────────────────────────────────────────────── */}
          {variants?.length ? (
            <>
              <SectionTitle>Variants</SectionTitle>
              <div className="rounded-md border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground">Name</th>
                      <th className="px-3 py-2 text-right font-medium text-muted-foreground">Markup</th>
                      <th className="px-3 py-2 text-right font-medium text-muted-foreground">Sort</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* {variants.map((v, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="px-3 py-2">{v.name}</td>
                        <td className="px-3 py-2 text-right">৳{v.markup}</td>
                        <td className="px-3 py-2 text-right text-muted-foreground">{v.sortOrder}</td>
                      </tr>
                    ))} */}
                  </tbody>
                </table>
              </div>
            </>
          ) : null}

          {/* ── Add-ons ───────────────────────────────────────────────────── */}
          {addOns?.length ? (
            <>
              <SectionTitle>Add-ons</SectionTitle>
              <div className="rounded-md border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground">Name</th>
                      <th className="px-3 py-2 text-right font-medium text-muted-foreground">Price</th>
                      <th className="px-3 py-2 text-right font-medium text-muted-foreground">Available</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* {addOns.map((a, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="px-3 py-2">{a.name}</td>
                        <td className="px-3 py-2 text-right">৳{a.price}</td>
                        <td className="px-3 py-2 text-right">
                          <Badge variant={a.isAvailable ? "default" : "secondary"}>
                            {a.isAvailable ? "Yes" : "No"}
                          </Badge>
                        </td>
                      </tr>
                    ))} */}
                  </tbody>
                </table>
              </div>
            </>
          ) : null}

          {/* ── Tags ──────────────────────────────────────────────────────── */}
          {tags?.length ? (
            <>
              <SectionTitle>Tags</SectionTitle>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <Badge key={t} variant="secondary">
                    {t}
                  </Badge>
                ))}
              </div>
            </>
          ) : null}

          {/* ── Timestamps ────────────────────────────────────────────────── */}
          {(createdAt || updatedAt) && (
            <>
              <SectionTitle>Timestamps</SectionTitle>
              {createdAt && <Row label="Created" value={new Date(createdAt).toLocaleString()} />}
              {updatedAt && <Row label="Last Updated" value={new Date(updatedAt).toLocaleString()} />}
            </>
          )}
        </div>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div className="flex justify-end px-6 py-4 border-t bg-muted/50">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default MenuViewDetailsDialog
