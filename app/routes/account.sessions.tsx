import { Placeholder } from "~/components/Placeholder";

export default function SessionsPage() {
  return (
    <Placeholder
      title="Active sessions"
      phase="GET /api/auth/sessions, DELETE /api/auth/sessions/:id (notes.md §9)"
    />
  );
}