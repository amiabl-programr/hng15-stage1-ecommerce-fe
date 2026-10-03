import { AdminLayout } from "~/components/layout/AdminLayout";
import { RequireAdmin } from "~/components/guards/RequireAdmin";

export default function AdminRoute() {
  return (
    <RequireAdmin>
      <AdminLayout />
    </RequireAdmin>
  );
}