import { Placeholder } from "~/components/Placeholder";

export default function LoginPage() {
  return (
    <Placeholder
      title="Sign in"
      phase="Full-page redirect to /api/auth/google — no fetch, so this screen is buildable as soon as VITE_API_URL is set (notes.md §5, §9)"
    />
  );
}