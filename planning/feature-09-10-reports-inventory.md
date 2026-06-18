Reports & Inventory

Implemented:

- CSV export API at `/api/reports/export?type=orders|payments|inventory` (returns CSV attachments).
- Dashboard UI at `src/app/dashboard/reports/page.tsx` and `src/components/modules/Dashboard/ReportsManagerContent.tsx` with buttons to download CSVs.

Limitations:

- Date filtering not implemented (stores are in-memory). For production filtering, add date fields and DB queries.
- Scheduling exports requires background jobs or cron on `ahar-server`.

Next Steps:

- Add date-range filters and export options (CSV, XLSX).
- Add scheduled exports using server cron or a task runner.
