interface ComparisonRow {
  label: string;
  values: string[];
}

interface ComparisonTableProps {
  headers: string[];
  rows: ComparisonRow[];
  caption?: string;
}

export function ComparisonTable({ headers, rows, caption }: ComparisonTableProps) {
  return (
    <figure className="not-prose my-8 overflow-x-auto">
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="px-3 py-2 font-medium text-muted-foreground"> </th>
            {headers.map((h) => (
              <th key={h} className="px-3 py-2 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-border/60">
              <th scope="row" className="px-3 py-2 font-medium">
                {row.label}
              </th>
              {row.values.map((value, i) => (
                <td key={`${row.label}-${i}`} className="px-3 py-2 text-muted-foreground">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {caption ? (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
