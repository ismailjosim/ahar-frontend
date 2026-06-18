Feature 08 — Reservation Management

API (Next.js app routes)

- GET /api/reservations?page=1&pageSize=20&status=&search=
  - Returns { data: AdminReservationRow[], total }
- GET /api/reservations/:id
  - Returns single reservation or 404
- POST /api/reservations
  - Body: { customer, phone, guests, time, table, status }
  - Creates reservation
- PATCH /api/reservations/:id
  - Updates reservation
- DELETE /api/reservations/:id
  - Deletes reservation

Notes

- Uses in-memory store at `src/lib/reservations.store.ts` seeded from `recentAdminReservations`.
- Dashboard page at `src/app/dashboard/reservations/page.tsx` and UI at `src/components/modules/Dashboard/ReservationsManagerContent.tsx`.

Next steps

- Add calendar and table-map views for scheduling.
- Integrate with `ahar-server` and notification system.
- Add validation, tests, and role-based access control.
