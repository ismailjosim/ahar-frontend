import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'


import type { MenuItem } from '@/types/menu.interface'

import { ColumnDef } from '@tanstack/react-table'
import {
  ArchiveX,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react'

import Image from 'next/image'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/cart.utils'
import { softDeleteMenuItem } from '@/services/menu/menusManagement'

interface MenuColumnsOptions {
  onEdit: (menuItem: MenuItem) => void
  onView: (menuItem: MenuItem) => void
  onDelete: (menuItem: MenuItem) => void
  onRefresh: () => void
}

export const menuColumns = ({
  onEdit,
  onView,
  onDelete,
  onRefresh,
}: MenuColumnsOptions): ColumnDef<MenuItem>[] => [
  // ── Image ───────────────────────────────────────────────────────────
  {
    id: 'image',
    header: 'Image',
    cell: ({ row }) => {
      const item = row.original

      return item.imageUrl ? (
        <Image
          src={item.imageUrl}
          alt={item.name}
          width={44}
          height={44}
          className='rounded-md border border-border object-cover'
        />
      ) : (
        <div className='size-11 rounded-md border border-border bg-muted flex items-center justify-center text-xs text-muted-foreground'>
          {item.name.charAt(0).toUpperCase()}
        </div>
      )
    },
  },

  // ── Name ────────────────────────────────────────────────────────────
  {
    accessorKey: 'name',
    header: 'Menu Item',
    cell: ({ row }) => {
      const item = row.original

      return (
        <div className='space-y-1'>
          <p className='font-medium text-sm leading-none'>{item.name}</p>

          {item.description && (
            <p className='text-xs text-muted-foreground line-clamp-1'>
              {item.description}
            </p>
          )}
        </div>
      )
    },
  },

  // ── Category ────────────────────────────────────────────────────────
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const category = row.original.category as string

      return (
        <span className='text-sm font-medium text-muted-foreground'>
          {category || 'N/A'}
        </span>
      )
    },
  },

  // ── Price ──────────────────────────────────────────────────────────
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => (
      <span className='text-sm font-semibold text-primary'>
        {formatCurrency(row.original.price)}
      </span>
    ),
  },

  // ── Rating ─────────────────────────────────────────────────────────
  {
    accessorKey: 'rating',
    header: 'Rating',
    cell: ({ row }) => {
      const rating = row.original.rating

      return rating ? (
        <div className='flex items-center gap-1'>
          <span className='text-sm font-semibold'>⭐</span>
          <span className='text-sm font-medium'>{rating.toFixed(1)}</span>
        </div>
      ) : (
        <span className='text-xs text-muted-foreground'>No rating</span>
      )
    },
  },

  // ── Status ──────────────────────────────────────────────────────────
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const item = row.original
      const statuses = []

      if (item.isFeatured) {
        statuses.push(
          <Badge key='featured' variant='default' className='text-xs'>
            Featured
          </Badge>
        )
      }

      if (item.isSpicy) {
        statuses.push(
          <Badge key='spicy' variant='secondary' className='text-xs'>
            🌶️ Spicy
          </Badge>
        )
      }

      if (!item.isAvailable) {
        statuses.push(
          <Badge key='unavailable' variant='destructive' className='text-xs'>
            Out of Stock
          </Badge>
        )
      }

      return (
        <div className='flex flex-wrap gap-1'>
          {statuses.length > 0 ? (
            statuses
          ) : (
            <Badge variant='outline' className='text-xs'>
              Available
            </Badge>
          )}
        </div>
      )
    },
  },

  // ── Created ─────────────────────────────────────────────────────────
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => (
      <span className='text-sm text-muted-foreground'>
        {new Date(row.original.createdAt).toLocaleDateString()}
      </span>
    ),
  },

  // ── Actions ─────────────────────────────────────────────────────────
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const item = row.original

      const handleSoftDelete = async () => {
        const res = await softDeleteMenuItem(item.id)

        if (res?.success) {
          toast.success(res.message || 'Item archived successfully')
          onRefresh()
        } else {
          toast.error(res?.message || 'Failed to archive item')
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='size-8'
            >
              <MoreHorizontal className='size-4' />
              <span className='sr-only'>Open menu</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => onView(item)}
            >
              <Eye className='mr-2 size-4' />
              View Details
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onEdit(item)}
            >
              <Pencil className='mr-2 size-4' />
              Edit
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleSoftDelete}
              className='text-yellow-600 focus:text-yellow-600'
            >
              <ArchiveX className='mr-2 size-4' />
              Archive
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onDelete(item)}
              className='text-destructive focus:text-destructive'
            >
              <Trash2 className='mr-2 size-4' />
              Delete Permanently
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]