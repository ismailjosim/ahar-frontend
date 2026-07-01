/* eslint-disable @typescript-eslint/no-explicit-any */

'use server'

import { serverFetch } from '@/lib/server-fetch'
import { zodValidator } from '@/lib/zodValidator'
import { createCategoryZodSchema, updateCategoryZodSchema } from '@/schema/category.validation'



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

function validateFile(
    file: File | null,
    required: boolean
) {
    if (!file || file.size === 0) {
        if (required) {
            return {
                success: false as const,
                message: 'Validation failed',
                errors: [
                    {
                        field: 'file',
                        message:
                            'Please upload an image',
                    },
                ],
            }
        }

        return null
    }

    if (
        !ALLOWED_IMAGE_TYPES.includes(
            file.type
        )
    ) {
        return {
            success: false as const,
            message: 'Validation failed',
            errors: [
                {
                    field: 'file',
                    message:
                        'Only JPEG, PNG, WebP, or GIF images are allowed',
                },
            ],
        }
    }

    return null
}

// ── Shared payload builder ────────────────────────────

function buildPayload(
    formData: FormData
) {
    return {
        name: formData.get(
            'name'
        ) as string,

        slug:
            (formData.get(
                'slug'
            ) as string) || undefined,

        description:
            (formData.get(
                'description'
            ) as string) || undefined,

        icon:
            (formData.get(
                'icon'
            ) as string) || undefined,

        status:
            (formData.get(
                'status'
            ) as string) || 'ACTIVE',
    }
}

// ======================================================
// CREATE CATEGORY
// ======================================================

export async function createCategory(
    _prevState: any,
    formData: FormData
) {
    try {
        const file = formData.get(
            'file'
        ) as File | null

        const fileError =
            validateFile(file, true)

        if (fileError) {
            return fileError
        }

        const payload =
            buildPayload(formData)

        const validation =
            zodValidator(
                payload,
                createCategoryZodSchema
            )

        if (!validation.success) {
            return validation
        }

        const newFormData =
            new FormData()

        newFormData.append(
            'data',
            JSON.stringify(
                validation.data
            )
        )

        newFormData.append(
            'file',
            file as Blob
        )

        const res =
            await serverFetch.post(
                '/category/create',
                {
                    body: newFormData,
                }
            )

        return await res.json()
    } catch (error: any) {
        console.error(error)

        return {
            success: false,
            message:
                process.env.NODE_ENV ===
                    'development'
                    ? error.message
                    : 'Failed to create category. Please try again.',
        }
    }
}

// ======================================================
// GET ALL CATEGORIES
// ======================================================

export async function getCategories(
    queryString?: string
) {
    console.log('queryString', queryString);

    try {
        const res =
            await serverFetch.get(
                `/category${queryString
                    ? `?${queryString}`
                    : ''
                }`
            )

        return await res.json()
    } catch (error: any) {
        console.error(error)

        return {
            success: false,
            message:
                process.env.NODE_ENV ===
                    'development'
                    ? error.message
                    : 'Something went wrong!',
        }
    }
}

// ======================================================
// GET CATEGORY BY ID
// ======================================================

export async function getCategoryById(
    id: string
) {
    try {
        const res =
            await serverFetch.get(
                `/category/${id}`
            )

        return await res.json()
    } catch (error: any) {
        console.error(error)

        return {
            success: false,
            message:
                process.env.NODE_ENV ===
                    'development'
                    ? error.message
                    : 'Something went wrong!',
        }
    }
}

// ======================================================
// UPDATE CATEGORY
// ======================================================

export async function updateCategory(
    id: string,
    _prevState: any,
    formData: FormData
) {
    try {
        const file = formData.get(
            'file'
        ) as File | null

        const fileError =
            validateFile(file, false)

        if (fileError) {
            return fileError
        }

        const payload =
            buildPayload(formData)

        const validation =
            zodValidator(
                payload,
                updateCategoryZodSchema
            )

        if (!validation.success) {
            return validation
        }

        const hasNewImage =
            !!file?.size

        if (hasNewImage) {
            const newFormData =
                new FormData()

            newFormData.append(
                'data',
                JSON.stringify(
                    validation.data
                )
            )

            newFormData.append(
                'file',
                file as Blob
            )

            const res =
                await serverFetch.patch(
                    `/category/${id}`,
                    {
                        body: newFormData,
                    }
                )

            return await res.json()
        }

        const res =
            await serverFetch.patch(
                `/category/${id}`,
                {
                    headers: {
                        'Content-Type':
                            'application/json',
                    },
                    body: JSON.stringify(
                        validation.data
                    ),
                }
            )

        return await res.json()
    } catch (error: any) {
        console.error(error)

        return {
            success: false,
            message:
                process.env.NODE_ENV ===
                    'development'
                    ? error.message
                    : 'Failed to update category. Please try again.',
        }
    }
}

// ======================================================
// SOFT DELETE CATEGORY
// ======================================================

export async function softDeleteCategory(
    id: string
) {
    try {
        const res =
            await serverFetch.delete(
                `/category/soft/${id}`
            )

        return await res.json()
    } catch (error: any) {
        console.error(error)

        return {
            success: false,
            message:
                process.env.NODE_ENV ===
                    'development'
                    ? error.message
                    : 'Something went wrong!',
        }
    }
}

// ======================================================
// HARD DELETE CATEGORY
// ======================================================

export async function deleteCategory(
    id: string
) {
    try {
        const res =
            await serverFetch.delete(
                `/category/${id}`
            )

        return await res.json()
    } catch (error: any) {
        console.error(error)

        return {
            success: false,
            message:
                process.env.NODE_ENV ===
                    'development'
                    ? error.message
                    : 'Something went wrong!',
        }
    }
}