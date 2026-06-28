export type CategoryStatus =
    | 'ACTIVE'
    | 'INACTIVE'
    | 'ARCHIVED'

export interface Category {
    id: string
    name: string
    slug: string
    description?: string | null
    image?: string | null
    icon?: string | null
    status: CategoryStatus
    createdAt: string
    updatedAt: string
}