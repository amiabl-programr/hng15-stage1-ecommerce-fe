import { Fragment, type HTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes, type ReactNode } from "react";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { cn } from "~/lib/cn";

export type Column<T> = {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  /** Repeat on the mobile card. Set false for columns that are noise at that width. */
  inCard?: boolean;
  align?: "left" | "right";
  /** Tabular figures — money, SKUs, quantities, order numbers. */
  mono?: boolean;
  className?: string;
};

export type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  caption: string;
  /** Turns each row into a link target, exposed as a real anchor. */
  rowHref?: (row: T) => string;
  empty?: ReactNode;
  className?: string;
};

/**
 * Wide admin table, or a stack of labelled cards on a phone.
 *
 * The mobile rendering is not a horizontally scrolling table with a
 * `min-width` — every admin screen in notes.md §9 is six or more columns
 * and none of them survive a 360px viewport that way. Below `md` each row
 * becomes a card with label/value pairs.
 *
 * The two renderings are both in the DOM; the one that does not apply is
 * `display: none`, so assistive technology only ever reads one of them.
 */
export function DataTable<T>({
  columns,
  rows,
  getRowId,
  caption,
  rowHref,
  empty,
  className,
}: DataTableProps<T>) {
  if (rows.length === 0 && empty) {
    return <>{empty}</>;
  }

  const cardColumns = columns.filter((c) => c.inCard !== false);

  return (
    <div className={className}>
      <div className="hidden overflow-x-auto rounded-2xl border border-line md:block">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-line">
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cn(
                    "px-4 py-3 text-xs font-bold tracking-wider text-muted uppercase",
                    column.align === "right" ? "text-right" : "text-left",
                    column.className,
                  )}
                >
                  {column.header}
                </th>
              ))}
              {rowHref ? (
                <th scope="col" className="w-10 px-4 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={getRowId(row)}
                className="border-b border-line last:border-0 hover:bg-raised"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      "px-4 py-3 align-middle",
                      column.align === "right" ? "text-right" : "text-left",
                      column.mono && "font-mono text-xs",
                      column.className,
                    )}
                  >
                    {column.cell(row)}
                  </td>
                ))}
                {rowHref ? (
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={rowHref(row)}
                      className="text-accent inline-flex items-center rounded p-1 hover:opacity-80"
                    >
                      <ChevronRight aria-hidden className="size-5" />
                      <span className="sr-only">Open</span>
                    </Link>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden">
        {rows.map((row) => (
          <Fragment key={getRowId(row)}>
            <li className="rounded-2xl border border-line bg-page p-4">
              <dl className="space-y-2">
                {cardColumns.map((column) => (
                  <div
                    key={column.key}
                    className="flex items-baseline justify-between gap-4"
                  >
                    <dt className="text-xs font-bold tracking-wider text-muted uppercase">
                      {column.header}
                    </dt>
                    <dd
                      className={cn(
                        "min-w-0 text-right text-sm",
                        column.mono && "font-mono text-xs",
                      )}
                    >
                      {column.cell(row)}
                    </dd>
                  </div>
                ))}
              </dl>

              {rowHref ? (
                <Link
                  to={rowHref(row)}
                  className="text-accent mt-4 inline-flex items-center gap-1 text-sm font-bold"
                >
                  Open
                  <ChevronRight aria-hidden className="size-4" />
                </Link>
              ) : null}
            </li>
          </Fragment>
        ))}
      </ul>
    </div>
  );
}

// ── Standard Primitives for custom table compositions ──────────────────────────

export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn("w-full caption-bottom text-sm border-collapse", className)} {...props} />
    </div>
  );
}

export function TableHeader({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("[&_tr]:border-b border-line", className)} {...props} />;
}

export function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

export function TableRow({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "border-b border-line transition-colors hover:bg-raised/50 data-[state=selected]:bg-raised",
        className
      )}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      scope="col"
      className={cn(
        "h-10 px-4 text-left align-middle text-xs font-bold uppercase tracking-wider text-muted [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
      {...props}
    />
  );
}