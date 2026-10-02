import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { DataTable, type Column } from "./Table";
import { EmptyState } from "./EmptyState";

type Row = { id: string; sku: string; stock: number };

const rows: Row[] = [
  { id: "1", sku: "RS-001", stock: 12 },
  { id: "2", sku: "RS-002", stock: 0 },
];

const columns: Column<Row>[] = [
  { key: "sku", header: "SKU", cell: (row) => row.sku, mono: true },
  { key: "stock", header: "Stock", cell: (row) => row.stock, align: "right", mono: true },
  { key: "hidden", header: "Internal", cell: (row) => row.id, inCard: false },
];

function renderTable() {
  return render(
    <MemoryRouter>
      <DataTable
        caption="Inventory"
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
      />
    </MemoryRouter>,
  );
}

describe("DataTable", () => {
  it("uses a real table with column headers scoped to the column", () => {
    renderTable();

    const table = screen.getByRole("table", { name: "Inventory" });
    const headers = within(table).getAllByRole("columnheader");
    expect(headers).toHaveLength(3);
    expect(headers.every((th) => th.tagName === "TH")).toBe(true);
    for (const header of headers) expect(header).toHaveAttribute("scope", "col");
  });

  it("also renders a labelled card per row, with values repeated", () => {
    renderTable();

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(rows.length);
    expect(within(items[0]).getByText("SKU")).toBeInTheDocument();
    expect(within(items[0]).getByText("RS-001")).toBeInTheDocument();
  });

  it("drops columns marked inCard:false from the mobile cards", () => {
    renderTable();

    const items = screen.getAllByRole("listitem");
    expect(within(items[0]).queryByText("Internal")).not.toBeInTheDocument();
  });

  /**
   * jsdom does not evaluate media queries, so the breakpoint itself
   * cannot be exercised here. What is asserted is that both renderings
   * exist and each is hidden at the other's breakpoint — which is the
   * part that regresses when someone edits the wrapper classes.
   */
  it("hides each rendering at the other's breakpoint", () => {
    const { container } = renderTable();

    const desktop = container.querySelector(".md\\:block");
    const mobile = container.querySelector("ul.md\\:hidden");

    expect(desktop).toHaveClass("hidden");
    expect(desktop).toHaveClass("md:block");
    expect(mobile).toHaveClass("md:hidden");
  });

  it("renders an empty state instead of a headerless table", () => {
    render(
      <MemoryRouter>
        <DataTable
          caption="Inventory"
          columns={columns}
          rows={[]}
          getRowId={(row) => row.id}
          empty={<EmptyState title="No stock records" />}
        />
      </MemoryRouter>,
    );

    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.getByText("No stock records")).toBeInTheDocument();
  });

  it("exposes row links as real anchors with an accessible name", () => {
    render(
      <MemoryRouter>
        <DataTable
          caption="Inventory"
          columns={columns}
          rows={rows}
          getRowId={(row) => row.id}
          rowHref={(row) => `/admin/inventory/${row.id}`}
        />
      </MemoryRouter>,
    );

    // Scoped to the table because the card rendering carries its own
    // "Open" link; only one of the two is ever displayed.
    const table = screen.getByRole("table", { name: "Inventory" });
    const links = within(table).getAllByRole("link", { name: "Open" });

    expect(links).toHaveLength(rows.length);
    expect(links[0]).toHaveAttribute("href", "/admin/inventory/1");
  });
});