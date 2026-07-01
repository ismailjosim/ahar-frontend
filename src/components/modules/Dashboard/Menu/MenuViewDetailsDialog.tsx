'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Badge } from '@/components/ui/badge'
import type { MenuItem } from '@/types/menu.interface'
import Image from 'next/image'
import { formatCurrency } from '@/lib/cart.utils'

interface MenuViewDetailsDialogProps {
  open: boolean
  onClose: () => void
  menuItem: MenuItem | null
}

const MenuViewDetailsDialog = ({
  open,
  onClose,
  menuItem,
}: MenuViewDetailsDialogProps) => {
  if (!menuItem) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-3xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Menu Item Details</DialogTitle>

          <DialogDescription>
            View complete information about this menu item.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Image */}
          <div className='flex justify-center'>
            {menuItem.imageUrl ? (
              <Image
                src={menuItem.imageUrl}
                alt={menuItem.name}
                width={200}
                height={200}
                className='rounded-lg border object-cover'
              />
            ) : (
              <div className='flex h-52 w-52 items-center justify-center rounded-lg border bg-muted text-sm text-muted-foreground'>
                No Image
              </div>
            )}
          </div>

          {/* Basic Information */}
          <div className='grid gap-4 md:grid-cols-2'>
            <div className='space-y-1'>
              <p className='text-sm text-muted-foreground'>Name</p>
              <p className='font-medium text-lg'>{menuItem.name}</p>
            </div>

            <div className='space-y-1'>
              <p className='text-sm text-muted-foreground'>Category</p>
              <p className='font-medium'>
                {menuItem.category || 'N/A'}
              </p>
            </div>

            <div className='space-y-1'>
              <p className='text-sm text-muted-foreground'>Price</p>
              <p className='font-medium text-lg text-primary'>
                {formatCurrency(menuItem.price)}
              </p>
            </div>

            <div className='space-y-1'>
              <p className='text-sm text-muted-foreground'>
                Rating
              </p>
              <p className='font-medium'>
                {menuItem.rating ? (
                  <span>
                    ⭐ {menuItem.rating.toFixed(1)} / 5
                  </span>
                ) : (
                  'No rating'
                )}
              </p>
            </div>

            {menuItem.prepTime && (
              <div className='space-y-1'>
                <p className='text-sm text-muted-foreground'>
                  Prep Time
                </p>
                <p className='font-medium'>
                  {menuItem.prepTime}
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          {menuItem.description && (
            <div className='space-y-2'>
              <p className='text-sm text-muted-foreground'>
                Description
              </p>
              <p className='whitespace-pre-wrap leading-relaxed'>
                {menuItem.description}
              </p>
            </div>
          )}

          {/* Status Badges */}
          <div className='space-y-2'>
            <p className='text-sm text-muted-foreground'>Status</p>
            <div className='flex flex-wrap gap-2'>
              {menuItem.isFeatured && (
                <Badge variant='default'>Featured</Badge>
              )}
              {menuItem.isSpicy && (
                <Badge variant='secondary'>
                  🌶️ Spicy
                </Badge>
              )}
              {menuItem.isAvailable ? (
                <Badge variant='outline'>Available</Badge>
              ) : (
                <Badge variant='destructive'>
                  Out of Stock
                </Badge>
              )}
            </div>
          </div>

          {/* Tags */}
          {menuItem.tags && menuItem.tags.length > 0 && (
            <div className='space-y-2'>
              <p className='text-sm text-muted-foreground'>Tags</p>
              <div className='flex flex-wrap gap-2'>
                {menuItem.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant='outline'
                    className='text-xs'
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Variants */}
          {menuItem.variants &&
            menuItem.variants.length > 0 && (
              <div className='space-y-3'>
                <p className='text-sm font-semibold text-foreground'>
                  Variants
                </p>
                <div className='space-y-2'>
                  {menuItem.variants.map((variant, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3'
                    >
                      <span className='font-medium text-sm'>
                        {variant.name}
                      </span>
                      <span className='text-sm font-semibold text-primary'>
                        {/* +{formatCurrency(variant)} */}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Add-ons */}
          {menuItem.addOns &&
            menuItem.addOns.length > 0 && (
              <div className='space-y-3'>
                <p className='text-sm font-semibold text-foreground'>
                  Add-ons
                </p>
                <div className='space-y-2'>
                  {menuItem.addOns.map((addOn, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3'
                    >
                      <span className='font-medium text-sm'>
                        {addOn.name}
                      </span>
                      <span className='text-sm font-semibold text-primary'>
                        +{formatCurrency(addOn.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Timestamps */}
          <div className='grid gap-4 md:grid-cols-2 pt-4 border-t'>
            <div className='space-y-1'>
              <p className='text-sm text-muted-foreground'>
                Created At
              </p>
              <p className='font-medium text-sm'>
                {new Date(
                  menuItem.createdAt
                ).toLocaleString()}
              </p>
            </div>

            <div className='space-y-1'>
              <p className='text-sm text-muted-foreground'>
                Updated At
              </p>
              <p className='font-medium text-sm'>
                {new Date(
                  menuItem.updatedAt
                ).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default MenuViewDetailsDialog