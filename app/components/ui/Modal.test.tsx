import { render, screen, fireEvent } from "@testing-library/react";
import { useState } from "react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "./Modal";

const noop = () => {};

describe("Modal", () => {
  it("renders nothing when closed", () => {
    render(
      <Modal open={false} onClose={noop} title="Edit product">
        body
      </Modal>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("exposes itself as a labelled modal dialog", () => {
    render(
      <Modal open onClose={noop} title="Edit product" description="Change the name">
        body
      </Modal>,
    );

    const dialog = screen.getByRole("dialog", { name: "Edit product" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleDescription("Change the name");
  });

  it("moves focus to the first control on open", () => {
    render(
      <Modal open onClose={noop} title="Edit product">
        <input aria-label="Name" />
      </Modal>,
    );

    expect(screen.getByRole("button", { name: "Close dialog" })).toHaveFocus();
  });

  it("closes on Escape", () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Edit product">
        body
      </Modal>,
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("wraps Tab from the last control back to the first", () => {
    render(
      <Modal
        open
        onClose={noop}
        title="Edit product"
        footer={
          <button type="button">Save</button>
        }
      >
        <input aria-label="Name" />
      </Modal>,
    );

    const save = screen.getByRole("button", { name: "Save" });
    save.focus();

    fireEvent.keyDown(document, { key: "Tab" });
    expect(screen.getByRole("button", { name: "Close dialog" })).toHaveFocus();
  });

  it("wraps Shift+Tab from the first control back to the last", () => {
    render(
      <Modal
        open
        onClose={noop}
        title="Edit product"
        footer={
          <button type="button">Save</button>
        }
      >
        <input aria-label="Name" />
      </Modal>,
    );

    screen.getByRole("button", { name: "Close dialog" }).focus();

    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(screen.getByRole("button", { name: "Save" })).toHaveFocus();
  });

  it("locks background scrolling while open", () => {
    const { rerender } = render(
      <Modal open onClose={noop} title="Edit product">
        body
      </Modal>,
    );
    expect(document.body.style.overflow).toBe("hidden");

    rerender(
      <Modal open={false} onClose={noop} title="Edit product">
        body
      </Modal>,
    );
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it("restores focus to whatever opened it", async () => {
    const user = userEvent.setup();

    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Edit
          </button>
          <Modal open={open} onClose={() => setOpen(false)} title="Edit product">
            body
          </Modal>
        </>
      );
    }

    render(<Harness />);

    const trigger = screen.getByRole("button", { name: "Edit" });
    await user.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});