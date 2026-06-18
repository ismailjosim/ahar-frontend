Feature 09 — Payment Management

API (Next.js app routes)

- GET /api/payments?page=1&pageSize=20&status=&search=
  - Returns { data: PaymentRecord[], total }
- GET /api/payments/:id
  - Returns single payment or 404
- POST /api/payments
  - Body: { orderId, transactionId, method, amount, status }
  - Creates payment record
- PATCH /api/payments/:id
  - Body: { status }
  - Update payment status (e.g., refund)

Notes

- Uses in-memory store at `src/lib/payments.store.ts` for now.
- Dashboard page: `src/app/dashboard/payments/page.tsx` and UI: `src/components/modules/Dashboard/PaymentsManagerContent.tsx`.
- Refund action updates status to `Refunded` in the mock store.

Next steps

- Integrate with real payment providers (bKash, Nagad, SSLCOMMERZ) via `ahar-server`.
- Add secure webhook endpoints for provider callbacks.
- Implement reconciliation tools and export CSV reports.
- Add tests for refunds and reconciliation flows.
