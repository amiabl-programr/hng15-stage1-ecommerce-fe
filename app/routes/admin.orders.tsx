import { Placeholder } from "~/components/Placeholder";

export default function AdminOrdersPage() {
  return (
    <Placeholder
      title="Orders"
      phase="GET /api/admin/orders, PATCH /api/admin/orders/:id/status — ?status= filter in the URL (notes.md §9)"
    />
  );
}