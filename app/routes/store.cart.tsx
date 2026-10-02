import { Link } from "react-router";
import { ShoppingBag } from "lucide-react";
import { EmptyState } from "~/components/ui/EmptyState";
import { buttonClasses } from "~/components/ui/Button";

export default function CartPage() {
  return (
    <div className="shell-container py-16">
      <h1 className="text-3xl">Your cart</h1>
      <EmptyState
        className="mt-8"
        icon={<ShoppingBag aria-hidden className="size-10" />}
        title="Your cart is empty"
        description="Browse the catalogue to find roofing sheet, profile and fabrication services."
        action={
          <Link to="/products" className={buttonClasses({ size: "lg" })}>
            Browse products
          </Link>
        }
      />
    </div>
  );
}