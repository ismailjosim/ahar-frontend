Feature 10 — Reports, Inventory & Settings

What implemented now (mocked, frontend-driven):

- Inventory store: `src/lib/inventory.store.ts` (initialized from menu items).
- Inventory API: `GET /api/inventory`, `GET/PATCH /api/inventory/:id`.
- Dashboard inventory page: `src/app/dashboard/inventory/page.tsx`.
- Inventory manager UI: `src/components/modules/Dashboard/InventoryManagerContent.tsx`.
- Orders now trigger inventory adjustments on completion via `adjustStockFromOrderItems` in `src/lib/orders.mock.ts`.

Notes and limitations:

- Stock adjustment uses a naive parser that matches menu item name fragments in the order items string. This is suitable for prototyping but should be replaced with structured order line-items in production.
- For production: integrate with `ahar-server` DB, record ingredient-level recipes, and add transactional booking/stock decrement.

Next steps:

- Replace naive parser with structured order items and recipe mapping.
- Add background reconciliation (daily stock audit) and export CSV report.
- Integrate with `ahar-server` for persistence and notification hooks.
