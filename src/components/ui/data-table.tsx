import type { MouseEvent, ReactNode } from "react";

/**
 * A2 data table — spec/foundations.md § A2. Sticky header, sortable
 * columns marked with an arrow, row hover fill, 48px rows. Row click opens
 * the detail panel; buttons inside the row must stop the click from
 * propagating to the row — use `stopRowPropagation` when wiring a row
 * action's `onClick` so this can't be forgotten per-screen.
 */
export function stopRowPropagation<E extends MouseEvent>(
  handler: (event: E) => void,
): (event: E) => void {
  return (event: E) => {
    event.stopPropagation();
    handler(event);
  };
}

export interface DataTableColumn<T> {
  key: string;
  header: string;
  align?: "left" | "right";
  sortable?: boolean;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  onSortChange?: (key: string) => void;
  emptyState?: ReactNode;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  sortKey,
  sortDirection = "asc",
  onSortChange,
  emptyState,
}: DataTableProps<T>) {
  if (rows.length === 0 && emptyState) {
    return <div className="rounded-md border border-line bg-surface">{emptyState}</div>;
  }

  return (
    <div className="overflow-x-auto rounded-md border border-line bg-surface">
      <table className="w-full border-collapse">
        <thead>
          <tr className="sticky top-0 z-10 bg-canvas">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={[
                  "border-b border-line px-4 py-2 type-label text-muted",
                  column.align === "right" ? "text-right" : "text-left",
                ].join(" ")}
              >
                {column.sortable ? (
                  <button
                    type="button"
                    onClick={() => onSortChange?.(column.key)}
                    className="inline-flex items-center gap-1 hover:text-body"
                  >
                    {column.header}
                    <span aria-hidden="true">
                      {sortKey === column.key
                        ? sortDirection === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </span>
                  </button>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={[
                "h-12 border-b border-line last:border-b-0",
                onRowClick ? "cursor-pointer hover:bg-canvas" : "",
              ].join(" ")}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={[
                    "px-4 type-body text-body",
                    column.align === "right" ? "text-right" : "text-left",
                  ].join(" ")}
                >
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
