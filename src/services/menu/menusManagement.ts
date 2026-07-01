/* eslint-disable @typescript-eslint/no-explicit-any */

'use server'

import { serverFetch } from '@/lib/server-fetch'
import { zodValidator } from '@/lib/zodValidator'
import { createMenuItemZodSchema, updateMenuItemZodSchema } from '@/schema/menu.validation'

// ── File validation ───────────────────────────────────

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
  'image/bmp',
  'image/tiff',
  'image/ico',
]

function validateFile(file: File | null, required: boolean) {
  if (!file || file.size === 0) {
    if (required) {
      return {
        success: false as const,
        message: 'Validation failed',
        errors: [
          {
            field: 'file',
            message: 'Please upload an image',
          },
        ],
      }
    }

    return null
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      success: false as const,
      message: 'Validation failed',
      errors: [
        {
          field: 'file',
          message: 'Only JPEG, PNG, WebP, GIF images are allowed',
        },
      ],
    }
  }

  return null
}

// ── Shared payload builder ────────────────────────────

function buildPayload(formData: FormData) {
  // Parse tags from comma-separated string
  const tagsString = (formData.get('tags') as string) || ''
  const tags = tagsString
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)

  // Parse variants from JSON
  const variantsString = (formData.get('variants') as string) || '[]'
  let variants = []
  try {
    variants = JSON.parse(variantsString)
  } catch {
    variants = []
  }

  // Parse addOns from JSON
  const addOnsString = (formData.get('addOns') as string) || '[]'
  let addOns = []
  try {
    addOns = JSON.parse(addOnsString)
  } catch {
    addOns = []
  }

  // Parse rating
  const ratingString = (formData.get('rating') as string) || ''
  const rating = ratingString ? parseFloat(ratingString) : undefined

  return {
    name: (formData.get('name') as string).trim(),
    description: ((formData.get('description') as string) || '').trim(),
    categoryId: formData.get('categoryId') as string,
    price: parseFloat(formData.get('price') as string),
    prepTime: ((formData.get('prepTime') as string) || '').trim() || undefined,
    tags,
    variants,
    addOns,
    isFeatured: formData.get('isFeatured') === 'true',
    isSpicy: formData.get('isSpicy') === 'true',
    isAvailable: formData.get('isAvailable') === 'true',
    rating,
  }
}

// ======================================================
// CREATE MENU ITEM
// ======================================================

export async function createMenuItem(_prevState: any, formData: FormData) {
  try {
    const file = (formData.get('file') as File | null) || null

    const fileError = validateFile(file, true)

    if (fileError) {
      return fileError
    }

    const payload = buildPayload(formData)

    const validation = zodValidator(payload, createMenuItemZodSchema)

    if (!validation.success) {
      return validation
    }

    const newFormData = new FormData()

    newFormData.append('data', JSON.stringify(validation.data))

    newFormData.append('file', file as Blob)

    const res = await serverFetch.post('/menu/create', {
      body: newFormData,
    })

    return await res.json()
  } catch (error: any) {
    console.error(error)

    return {
      success: false,
      message:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Failed to create menu item. Please try again.',
    }
  }
}

// ======================================================
// GET ALL MENU ITEMS
// ======================================================

export async function getMenuItems(queryString?: string) {
  try {
    const res = await serverFetch.get(
      `/menu${queryString ? `?${queryString}` : ''}`
    )

    return await res.json()
  } catch (error: any) {
    console.error(error)

    return {
      success: false,
      message:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Something went wrong!',
    }
  }
}

// ======================================================
// GET MENU ITEM BY ID
// ======================================================

export async function getMenuItemById(id: string) {
  try {
    const res = await serverFetch.get(`/menu/${id}`)

    return await res.json()
  } catch (error: any) {
    console.error(error)

    return {
      success: false,
      message:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Something went wrong!',
    }
  }
}

// ======================================================
// UPDATE MENU ITEM
// ======================================================

export async function updateMenuItem(
  id: string,
  _prevState: any,
  formData: FormData
) {
  try {
    const file = (formData.get('file') as File | null) || null

    const fileError = validateFile(file, false)

    if (fileError) {
      return fileError
    }

    const payload = buildPayload(formData)

    const validation = zodValidator(payload, updateMenuItemZodSchema)

    if (!validation.success) {
      return validation
    }

    const hasNewImage = !!file?.size

    if (hasNewImage) {
      const newFormData = new FormData()

      newFormData.append('data', JSON.stringify(validation.data))

      newFormData.append('file', file as Blob)

      const res = await serverFetch.patch(`/menu/${id}`, {
        body: newFormData,
      })

      return await res.json()
    }

    const res = await serverFetch.patch(`/menu/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validation.data),
    })

    return await res.json()
  } catch (error: any) {
    console.error(error)

    return {
      success: false,
      message:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Failed to update menu item. Please try again.',
    }
  }
}

// ======================================================
// SOFT DELETE MENU ITEM
// ======================================================

export async function softDeleteMenuItem(id: string) {
  try {
    const res = await serverFetch.delete(`/menu/soft/${id}`)

    return await res.json()
  } catch (error: any) {
    console.error(error)

    return {
      success: false,
      message:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Something went wrong!',
    }
  }
}

// ======================================================
// HARD DELETE MENU ITEM
// ======================================================

export async function deleteMenuItem(id: string) {
  try {
    const res = await serverFetch.delete(`/menu/${id}`)

    return await res.json()
  } catch (error: any) {
    console.error(error)

    return {
      success: false,
      message:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Something went wrong!',
    }
  }
}