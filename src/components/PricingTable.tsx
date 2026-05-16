export type PricingTier = {
  name: string;
  rangeZar: string;
  summary: string;
  timeline?: string;
};

export type PricingTableBlock = {
  id: string;
  title: string;
  intro?: string;
  tiers: PricingTier[];
  note?: string;
};

type PricingTableProps = {
  table: PricingTableBlock;
};

export function PricingTable({ table }: PricingTableProps) {
  return (
    <section id={table.id} className="scroll-mt-24">
      <h3 className="text-lg font-bold text-foreground mb-2">{table.title}</h3>
      {table.intro ? (
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">{table.intro}</p>
      ) : null}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th scope="col" className="text-left px-4 py-3 font-semibold text-foreground">
                Scope
              </th>
              <th scope="col" className="text-left px-4 py-3 font-semibold text-foreground">
                Typical range (ZAR)
              </th>
              <th scope="col" className="text-left px-4 py-3 font-semibold text-foreground hidden sm:table-cell">
                Timeline
              </th>
            </tr>
          </thead>
          <tbody>
            {table.tiers.map((tier, index) => (
              <tr
                key={tier.name}
                className={index % 2 === 0 ? 'bg-card' : 'bg-muted/20'}
              >
                <td className="px-4 py-3 align-top">
                  <p className="font-medium text-foreground">{tier.name}</p>
                  <p className="text-muted-foreground mt-1 leading-relaxed">{tier.summary}</p>
                </td>
                <td className="px-4 py-3 align-top font-semibold text-primary whitespace-nowrap">
                  {tier.rangeZar}
                </td>
                <td className="px-4 py-3 align-top text-muted-foreground hidden sm:table-cell whitespace-nowrap">
                  {tier.timeline ?? 'Varies'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.note ? (
        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{table.note}</p>
      ) : null}
    </section>
  );
}
