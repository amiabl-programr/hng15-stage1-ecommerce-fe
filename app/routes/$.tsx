import { Link } from "react-router";
import { buttonClasses } from "~/components/ui/Button";
import { EmptyState } from "~/components/ui/EmptyState";

export default function NotFoundPage() {
  return (
    <div className="shell-container py-16 sm:py-24">
      <EmptyState
        title="Page not found"
        description="That page does not exist, or it has moved. The catalogue is the best place to pick things up again."
        action={
          <Link to="/products" className={buttonClasses({ size: "lg" })}>
            Browse products
          </Link>
        }
      />
    </div>
  );
}