import { AccountLayout } from "~/components/layout/AccountLayout";
import { RequireAuth } from "~/components/guards/RequireAuth";

export default function AccountRoute() {
  return (
    <RequireAuth>
      <AccountLayout />
    </RequireAuth>
  );
}