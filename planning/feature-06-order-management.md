Feature 06 — Order Management

API (Next.js app routes)

- GET /api/orders?page=1&pageSize=10&status=&search=
  - Returns { data: AdminOrderRow[], total }
- GET /api/orders/:id
  - Returns single order or 404
- PATCH /api/orders/:id
  - Body: { status: "Pending" | "Preparing" | "Ready" | "Completed" }
  - Returns updated order

Notes

- Currently uses an in-memory mock store at `src/lib/orders.mock.ts`.
- Frontend dashboard page at `src/app/dashboard/orders/page.tsx` and UI component at `src/components/modules/Dashboard/OrdersPageContent.tsx` call these endpoints.
- Status update cycles to the next status and shows a simple alert notification.

Next steps

- Replace mock store with real backend (`ahar-server`) or DB.
- Add websocket/SSE for live updates.
- Add confirmation modals and role-based access controls.
