"use client"

/**
 * DeleteConfirmationDialog.tsx
 *
 * A modal dialog that asks the user to confirm before a destructive delete
 * action, preventing accidental data loss.
 *
 * Usage:
 *   <DeleteConfirmationDialog
 *     isOpen={!!deletingId}
 *     itemName="Royal Mutton Kacchi"
 *     onConfirm={handleDelete}
 *     onCancel={() => setDeletingId(null)}
 *   />
 */

import { Trash2 } from "lucide-react"

interface DeleteConfirmationDialogProps {
  isOpen: boolean
  itemName?: string
  description?: string
  confirmLabel?: string
  isDeleting?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteConfirmationDialog({
  isOpen,
  itemName,
  description,
  confirmLabel = "Delete",
  isDeleting = false,
  onConfirm,
  onCancel,
}: DeleteConfirmationDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xl">
        {/* Icon */}
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10">
          <Trash2 className="size-6 text-destructive" />
        </div>

        {/* Heading */}
        <h4 className="text-base font-bold text-foreground">
          {itemName ? `Delete "${itemName}"?` : "Confirm deletion"}
        </h4>

        {/* Body */}
        <p className="mt-1.5 text-sm text-muted-foreground">
          {description ?? "This action cannot be undone. The record will be permanently removed."}
        </p>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-xl bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground transition hover:bg-destructive/90 disabled:pointer-events-none disabled:opacity-50"
          >
            {isDeleting ? "Deleting…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
