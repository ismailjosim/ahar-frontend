"use client"

import { useEffect, useState } from "react"
import type { InventoryItem } from "@/lib/inventory.store"
import { lowStockItems } from "@/lib/inventory.store"

export default function InventoryManagerContent() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(false)

  async function fetchList() {
    setLoading(true)
    const res = await fetch(`/api/inventory`)
    const body = await res.json()
    setItems(body.data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchList()
  }, [])

  async function setStock(id: string, value: number) {
    const res = await fetch(`/api/inventory/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: value }),
    })
    if (res.ok) fetchList()
  }

  const low = lowStockItems()

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="col-span-2">
          <div className="rounded-lg border border-[#F3E5D8] bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
            <h3 className="font-bengali text-lg font-bold">Inventory Items</h3>
            {loading ? (
              <div className="p-6 text-center">Loading...</div>
            ) : (
              <table className="w-full text-left text-sm mt-4">
                <thead>
                  <tr className="border-b text-xs font-semibold text-gray-500">
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3 text-right">Stock</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={it.id} className="border-b">
                      <td className="px-4 py-3 font-mono text-xs">{it.id}</td>
                      <td className="px-4 py-3">{it.name}</td>
                      <td className="px-4 py-3 text-right">
                        {it.stock} {it.unit}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setStock(it.id, Math.max(0, it.stock - 1))}
                            className="rounded px-2 py-1 text-xs"
                          >
                            -1
                          </button>
                          <button onClick={() => setStock(it.id, it.stock + 1)} className="rounded px-2 py-1 text-xs">
                            +1
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <aside className="rounded-lg border border-[#F3E5D8] bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <h4 className="font-bengali text-md font-bold">Low Stock Alerts</h4>
          <div className="mt-3 space-y-2">
            {low.length === 0 ? (
              <div className="text-sm text-gray-500">No low stock items</div>
            ) : (
              low.map((l, idx) => (
                <div
                  key={idx}
                  className={`rounded p-2 ${l.severity === "critical" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}
                >
                  <div className="font-bold">{l.item}</div>
                  <div className="text-xs">{l.stock}</div>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
