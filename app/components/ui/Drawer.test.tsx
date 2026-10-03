import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Drawer } from "./Drawer";

const noop = () => {};

describe("Drawer", () => {
  it("renders nothing when closed", () => {
    render(
      <Drawer open={false} onClose={noop} title="Navigation menu">
        Content
      </Drawer>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders dialog when open with title and containerClassName", () => {
    render(
      <Drawer
        open={true}
        onClose={noop}
        title="Navigation menu"
        containerClassName="lg:hidden"
      >
        <p>Drawer Body Content</p>
      </Drawer>,
    );

    const dialog = screen.getByRole("dialog", { name: "Navigation menu" });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByText("Drawer Body Content")).toBeInTheDocument();
  });

  it("closes when close button is clicked", () => {
    const onClose = vi.fn();
    render(
      <Drawer open={true} onClose={onClose} title="Navigation menu">
        Content
      </Drawer>,
    );

    const closeBtn = screen.getByRole("button", { name: "Close menu" });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on Escape key press", () => {
    const onClose = vi.fn();
    render(
      <Drawer open={true} onClose={onClose} title="Navigation menu">
        Content
      </Drawer>,
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
