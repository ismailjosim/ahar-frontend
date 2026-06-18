export type PaymentStatus = "Pending" | "Completed" | "Failed" | "Refunded"

export interface PaymentRecord {
  id: string
  orderId?: string
  transactionId?: string
  method: string
  amount: number
  status: PaymentStatus
  createdAt: string
}

let payments: PaymentRecord[] = [
  {
    id: "P-1001",
    orderId: "1024",
    transactionId: "TXN-AB12",
    method: "bKash",
    amount: 1060,
    status: "Pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: "P-1002",
    orderId: "1023",
    transactionId: "TXN-CD34",
    method: "COD",
    amount: 820,
    status: "Completed",
    createdAt: new Date().toISOString(),
  },
  {
    id: "P-1003",
    orderId: "1022",
    transactionId: "TXN-EF56",
    method: "SSLCOMMERZ",
    amount: 1080,
    status: "Completed",
    createdAt: new Date().toISOString(),
  },
]

function genId() {
  return `P-${Date.now().toString().slice(-6)}`
}

export function listPayments({
  page = 1,
  pageSize = 20,
  status,
  search,
}: {
  page?: number
  pageSize?: number
  status?: string
  search?: string
}) {
  let filtered = payments.slice()
  if (status) filtered = filtered.filter((p) => p.status === status)
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.id.toLowerCase().includes(q) ||
        (p.orderId || "").includes(q) ||
        (p.transactionId || "").toLowerCase().includes(q) ||
        p.method.toLowerCase().includes(q),
    )
  }
  const total = filtered.length
  const start = (page - 1) * pageSize
  return { data: filtered.slice(start, start + pageSize), total }
}

export function getPayment(id: string) {
  return payments.find((p) => p.id === id) || null
}

export function createPayment(payload: Partial<PaymentRecord>) {
  const p: PaymentRecord = {
    id: payload.id || genId(),
    orderId: payload.orderId,
    transactionId: payload.transactionId || undefined,
    method: payload.method || "Unknown",
    amount: payload.amount || 0,
    status: (payload.status as PaymentStatus) || "Pending",
    createdAt: new Date().toISOString(),
  }
  payments = [p, ...payments]
  return p
}

export function updatePaymentStatus(id: string, status: PaymentStatus) {
  const idx = payments.findIndex((p) => p.id === id)
  if (idx === -1) return null
  payments[idx] = { ...payments[idx], status }
  return payments[idx]
}
