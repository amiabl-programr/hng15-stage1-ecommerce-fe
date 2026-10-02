import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Field } from "./Field";
import { Input } from "./Control";

describe("Field", () => {
  it("associates the label with the control by id", () => {
    render(
      <Field id="email" label="Email address">
        {(props) => <Input {...props} />}
      </Field>,
    );

    expect(screen.getByLabelText("Email address")).toHaveAttribute("id", "email");
  });

  it("points aria-describedby at both the hint and the error when both exist", () => {
    render(
      <Field id="phone" label="Phone" hint="Digits only" error="Required">
        {(props) => <Input {...props} />}
      </Field>,
    );

    const input = screen.getByLabelText(/Phone/);
    const describedBy = input.getAttribute("aria-describedby") ?? "";
    expect(describedBy.split(" ")).toEqual(
      expect.arrayContaining(["phone-error", "phone-hint"]),
    );
  });

  it("marks the control invalid and references the message", () => {
    render(
      <Field id="city" label="City" error="Required">
        {(props) => <Input {...props} />}
      </Field>,
    );

    const input = screen.getByLabelText(/City/);
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.getAttribute("aria-describedby")).toBe("city-error");

    const message = screen.getByText("Required");
    expect(message).toHaveAttribute("id", "city-error");
  });

  it("does not make every field error a live region", () => {
    render(
      <Field id="city" label="City" error="Required">
        {(props) => <Input {...props} />}
      </Field>,
    );

    // notes.md §10 puts the live region on the form's failure summary,
    // not on each field — otherwise every keystroke announces itself.
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("leaves aria-invalid unset when there is no error", () => {
    render(
      <Field id="city" label="City">
        {(props) => <Input {...props} />}
      </Field>,
    );

    expect(screen.getByLabelText(/City/)).not.toHaveAttribute("aria-invalid");
  });
});