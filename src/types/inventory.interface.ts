export interface InventoryAudit {
  id: string
  itemId: string
  details: string
  createdAt: Date
}

export interface InventoryItem {
  id: string
  name: string
  category: string
  sku: string | null
  stock: number
  unit: string
  threshold: number
  supplier: string | null
  unitCost: number
  lastRestocked: Date | null
  audits: InventoryAudit[]
  createdAt: Date
  updatedAt: Date
}
