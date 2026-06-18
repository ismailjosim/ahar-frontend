import { NextResponse } from "next/server"
import { listOrders } from "@/lib/orders.mock"
import { listPayments } from "@/lib/payments.store"
import { listInventory } from "@/lib/inventory.store"

function toCsv(rows: string[][]) {
  return rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n")
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const type = url.searchParams.get("type") || "orders"

  if (type === "orders") {
    const { data } = listOrders({ page: 1, pageSize: 1000 })
    const rows = [["Order ID", "Customer", "Phone", "Items", "Payment", "Total", "Status", "Type"]]
    data.forEach((o: any) => rows.push([o.id, o.customer, o.phone, o.items, o.method, o.total, o.status, o.type]))
    const csv = toCsv(rows)
    return new NextResponse(csv, {
      status: 200,
      headers: { "Content-Type": "text/csv", "Content-Disposition": "attachment; filename=orders_report.csv" },
    })
  }

  if (type === "payments") {
    const { data } = listPayments({ page: 1, pageSize: 1000 })
    const rows = [["Payment ID", "Order ID", "Txn ID", "Method", "Amount", "Status", "Created At"]]
    data.forEach((p: any) =>
      rows.push([p.id, p.orderId || "", p.transactionId || "", p.method, p.amount, p.status, p.createdAt]),
    )
    const csv = toCsv(rows)
    return new NextResponse(csv, {
      status: 200,
      headers: { "Content-Type": "text/csv", "Content-Disposition": "attachment; filename=payments_report.csv" },
    })
  }

  if (type === "inventory") {
    const { data } = listInventory({ page: 1, pageSize: 1000 })
    const rows = [["Item ID", "Name", "Stock", "Unit", "Threshold"]]
    data.forEach((i: any) => rows.push([i.id, i.name, i.stock, i.unit, i.threshold]))
    const csv = toCsv(rows)
    return new NextResponse(csv, {
      status: 200,
      headers: { "Content-Type": "text/csv", "Content-Disposition": "attachment; filename=inventory_report.csv" },
    })
  }

  return NextResponse.json({ error: "Unknown report type" }, { status: 400 })
}
