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

import { softDeleteCategory } from '@/services/category/categoriesManagement'
import type { Category } from '@/types/category.interface'

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

interface CategoryColumnsOptions {
  onEdit: (category: Category) => void
  onView: (category: Category) => void
  onDelete: (category: Category) => void
  onRefresh: () => void
}

export const categoriesColumns = ({
  onEdit,
  onView,
  onDelete,
  onRefresh,
}: CategoryColumnsOptions): ColumnDef<Category>[] => [
    // ── Image ───────────────────────────────────────────────────────────
    {
      id: 'image',
      header: 'Image',
      cell: ({ row }) => {
        const category = row.original

        return category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            width={44}
            height={44}
            className='rounded-md border border-border object-cover'
          />
        ) : (
          <div className='size-11 rounded-md border border-border bg-muted flex items-center justify-center text-xs text-muted-foreground'>
            N/A
          </div>
        )
      },
    },

    // ── Name ────────────────────────────────────────────────────────────
    {
      accessorKey: 'name',
      header: 'Category',
      cell: ({ row }) => {
        const category = row.original

        return (
          <div className='space-y-0.5'>
            <p className='font-medium text-sm leading-none'>
              {category.name}
            </p>

            <p className='text-xs text-muted-foreground'>
              /{category.slug}
            </p>
          </div>
        )
      },
    },

    // ── Status ──────────────────────────────────────────────────────────
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status

        const map: Record<
          string,
          {
            label: string
            variant:
            | 'default'
            | 'secondary'
            | 'destructive'
          }
        > = {
          ACTIVE: {
            label: 'Active',
            variant: 'default',
          },
          INACTIVE: {
            label: 'Inactive',
            variant: 'secondary',
          },
          ARCHIVED: {
            label: 'Archived',
            variant: 'destructive',
          },
        }

        const { label, variant } =
          map[status] ?? {
            label: status,
            variant: 'secondary',
          }

        return (
          <Badge variant={variant}>
            {label}
          </Badge>
        )
      },
    },

    // ── Created ─────────────────────────────────────────────────────────
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => (
        <span className='text-sm text-muted-foreground'>
          {new Date(
            row.original.createdAt
          ).toLocaleDateString()}
        </span>
      ),
    },

    // ── Actions ─────────────────────────────────────────────────────────
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const category = row.original

        const handleSoftDelete =
          async () => {
            const res =
              await softDeleteCategory(
                category.id
              )

            if (res?.success) {
              toast.success(
                res.message ||
                'Category archived successfully'
              )

              onRefresh()
            } else {
              toast.error(
                res?.message ||
                'Failed to archive category'
              )
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
                <span className='sr-only'>
                  Open menu
                </span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>
                Actions
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() =>
                  onView(category)
                }
              >
                <Eye className='mr-2 size-4' />
                View Details
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>
                  onEdit(category)
                }
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
                onClick={() =>
                  onDelete(category)
                }
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