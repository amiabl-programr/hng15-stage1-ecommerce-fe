import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CartBadge } from "./CartBadge";

describe("CartBadge", () => {
  it("renders no visible count when the cart is empty", () => {
    const { container } = render(<CartBadge count={0} />);
    expect(container.querySelector(".rounded-full")).toBeNull();
    expect(screen.getByText("Cart is empty")).toBeInTheDocument();
  });

  it("announces the count politely", () => {
    render(<CartBadge count={3} />);

    const live = screen.getByText("3 items in cart");
    expect(live).toHaveClass("sr-only");
    expect(live.closest("[aria-live]")).toHaveAttribute("aria-live", "polite");
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("caps the visible count but not the announcement", () => {
    render(<CartBadge count={250} />);
    expect(screen.getByText("99+")).toBeInTheDocument();
    expect(screen.getByText("250 items in cart")).toBeInTheDocument();
  });
});