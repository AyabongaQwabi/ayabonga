import type { GetTotalsResult } from '@/lib/quoteToolPricing';
import {
  CLIENT_QUOTE_BUFFER_PERCENT,
  CLIENT_QUOTE_HOURLY_RATE_ZAR,
  CLIENT_QUOTE_HOURS_PER_DAY,
  CLIENT_QUOTE_YEARS_EXPERIENCE,
} from '@/config/quoteToolConfig';

export type QuoteExportPayload = {
  projectTypes: string[];
  features: Array<{
    name: string;
    adjustedDays: number;
    adjustedPriceZar: number;
  }>;
  currency: string;
  hourlyRateZar: number;
  yearsExperience: number;
  hoursPerDay: number;
  bufferPercent: number;
  desiredDays: number | null;
  totals: {
    basePriceZar: number;
    adjustedPriceZar: number;
    estimatedDays: number;
    effectiveDesiredDays: number;
  };
};

type FeatureRow = {
  id: string;
  name: string;
};

type BuildArgs = {
  selectedProjectTypes: string[];
  selectedFeatures: string[];
  allFeatures: FeatureRow[];
  totals: GetTotalsResult;
  breakdown: Array<{
    id: string;
    name: string;
    adjusted_days: number;
    feature_adjusted_price: number;
  }>;
  currency: string;
  hourlyRate: string;
  yearsExperience: string;
  hoursPerDay: string;
  bufferPercent: number;
  buildTime: string;
};

export function buildQuoteExportPayload({
  selectedProjectTypes,
  breakdown,
  totals,
  currency,
  hourlyRate,
  yearsExperience,
  hoursPerDay,
  bufferPercent,
  buildTime,
}: BuildArgs): QuoteExportPayload {
  const desiredRaw = buildTime.trim() ? parseInt(buildTime, 10) : NaN;

  return {
    projectTypes: selectedProjectTypes,
    features: breakdown.map((row) => ({
      name: row.name,
      adjustedDays: row.adjusted_days,
      adjustedPriceZar: row.feature_adjusted_price,
    })),
    currency,
    hourlyRateZar:
      Math.max(1, parseInt(hourlyRate, 10)) || CLIENT_QUOTE_HOURLY_RATE_ZAR,
    yearsExperience:
      Math.max(0, parseInt(yearsExperience, 10)) ||
      CLIENT_QUOTE_YEARS_EXPERIENCE,
    hoursPerDay:
      Math.max(1, parseInt(hoursPerDay, 10)) || CLIENT_QUOTE_HOURS_PER_DAY,
    bufferPercent: bufferPercent ?? CLIENT_QUOTE_BUFFER_PERCENT,
    desiredDays: Number.isFinite(desiredRaw) ? desiredRaw : null,
    totals: {
      basePriceZar: totals.base_price,
      adjustedPriceZar: totals.adjusted_price,
      estimatedDays: totals.estimated_days,
      effectiveDesiredDays: totals.effective_desired_days,
    },
  };
}
