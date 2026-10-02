import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("disables itself and reports busy while loading", () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Save
      </Button>,
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(screen.getByText("Working")).toBeInTheDocument();
  });

  it("defaults to type=button so it cannot submit a form by accident", () => {
    render(<Button>Go</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("lets a caller override the type when submitting", () => {
    render(<Button type="submit">Go</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("lets a className prop win over the variant's own classes", () => {
    render(<Button className="rounded-full">Go</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("rounded-full");
    expect(button).not.toHaveClass("rounded-lg");
  });

  it("keeps the label readable when it is only an icon", () => {
    render(<Button aria-label="Add to cart">+</Button>);
    expect(screen.getByRole("button", { name: "Add to cart" })).toBeInTheDocument();
  });
});