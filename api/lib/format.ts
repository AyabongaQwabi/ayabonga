export function formatZar(amount: number): string {
  return `R${Math.round(amount).toLocaleString('en-ZA')}`;
}

export function formatMoneyZar(amountZar: number, currencyCode: string): string {
  const rates: Record<string, { symbol: string; rateToZar: number }> = {
    ZAR: { symbol: 'R', rateToZar: 1 },
    USD: { symbol: '$', rateToZar: 0.055 },
    EUR: { symbol: '€', rateToZar: 0.05 },
  };
  const opt = rates[currencyCode] ?? rates.ZAR;
  const value = amountZar * (currencyCode === 'ZAR' ? 1 : opt.rateToZar);
  return `${opt.symbol}${Math.round(value).toLocaleString('en-US')}`;
}

export function founderStageLabel(stage: string): string {
  const labels: Record<string, string> = {
    idea: 'Idea / pre-build',
    mvp: 'Building MVP',
    live: 'Live product',
    rebuild: 'Rebuild or rescue',
  };
  return labels[stage] ?? stage;
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
