import { z } from 'zod'

const statusEnum = z.enum(
    ['ACTIVE', 'INACTIVE', 'ARCHIVED'],
    {
        error: 'Invalid category status',
    }
)

const categorySchema = z.object({
    name: z
        .string({
            error: issue =>
                issue.input === undefined
                    ? 'Category name is required'
                    : 'Category name must be a string',
        })
        .trim()
        .min(2, {
            error:
                'Category name must be at least 2 characters',
        })
        .max(50, {
            error:
                'Category name cannot exceed 50 characters',
        }),

    slug: z
        .string()
        .trim()
        .min(2, {
            error: 'Slug must be at least 2 characters',
        })
        .max(60, {
            error: 'Slug cannot exceed 60 characters',
        })
        .optional(),

    description: z
        .string()
        .trim()
        .max(500, {
            error:
                'Description cannot exceed 500 characters',
        })
        .optional(),

    icon: z
        .string()
        .trim()
        .max(100, {
            error:
                'Icon cannot exceed 100 characters',
        })
        .optional(),

    status: statusEnum.default('ACTIVE').optional(),
})

export const createCategoryZodSchema =
    categorySchema

export const updateCategoryZodSchema =
    categorySchema