export interface Permission {
    id: string
    name: string
    resource: string
    action: string
    description: string | null
    category: string | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}
