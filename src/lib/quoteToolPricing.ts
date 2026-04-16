/**
 * Pure pricing logic for the developer quote tool.
 * Ported from quote-tool-oss `pricing.js`.
 */

import {
  EXPERIENCE_MULTIPLIER_MIN,
  EXPERIENCE_MULTIPLIER_MAX,
  EXPERIENCE_INTERCEPT,
  EXPERIENCE_SLOPE,
  MIN_PRICE_MULTIPLIER,
  MAX_DESIRED_TIME_MULTIPLIER,
  HOURS_PER_DAY,
} from '@/config/quoteToolConfig';

export type QuoteFeature = {
  id: string;
  name: string;
  days_to_complete?: number;
  complexity?: number;
  [key: string]: unknown;
};

export type GetTotalsOptions = {
  hourlyRate?: number;
  yearsExperience?: number;
  hoursPerDay?: number;
  desiredDays?: number | string;
  config?: Record<string, number>;
};

export type TotalsByFeatureRow = {
  id: string;
  name: string;
  complexity?: number;
  baseline_days: number;
  adjusted_days: number;
  feature_hours: number;
  feature_base_price: number;
  feature_adjusted_price?: number;
};

export type GetTotalsResult = {
  estimated_days: number;
  estimated_hours: number;
  base_price: number;
  effective_desired_days: number;
  time_ratio: number;
  effective_ratio: number;
  adjusted_price: number;
  hasFeatures: boolean;
  totals_by_feature: TotalsByFeatureRow[];
  bufferPercent: number;
};

export function experienceMultiplier(
  yearsExperience: number,
  config: Record<string, number> = {},
): number {
  const min = config.EXPERIENCE_MULTIPLIER_MIN ?? EXPERIENCE_MULTIPLIER_MIN;
  const max = config.EXPERIENCE_MULTIPLIER_MAX ?? EXPERIENCE_MULTIPLIER_MAX;
  const intercept = config.EXPERIENCE_INTERCEPT ?? EXPERIENCE_INTERCEPT;
  const slope = config.EXPERIENCE_SLOPE ?? EXPERIENCE_SLOPE;
  const years = Math.max(0, Number(yearsExperience) || 0);
  const raw = intercept - slope * years;
  return Math.max(min, Math.min(max, raw));
}

export function getTotals(
  selectedFeatureIds: string[],
  allFeatures: QuoteFeature[],
  options: GetTotalsOptions,
  bufferPercent = 0,
): GetTotalsResult {
  const {
    hourlyRate = 1000,
    yearsExperience = 0,
    hoursPerDay = HOURS_PER_DAY,
    desiredDays: desiredDaysInput,
    config = {},
  } = options;

  const rate = Math.max(0, Number(hourlyRate) || 0);
  const years = Math.max(0, Number(yearsExperience) || 0);
  const hoursDay = Math.max(0.1, Number(hoursPerDay) || HOURS_PER_DAY);
  const mult = experienceMultiplier(years, config);
  const minPriceMult = config.MIN_PRICE_MULTIPLIER ?? MIN_PRICE_MULTIPLIER;
  const maxTimeMult = config.MAX_DESIRED_TIME_MULTIPLIER ?? MAX_DESIRED_TIME_MULTIPLIER;

  const totalsByFeature: TotalsByFeatureRow[] = [];
  let estimatedDays = 0;
  let basePrice = 0;

  for (const id of selectedFeatureIds || []) {
    const f = allFeatures.find((x) => x.id === id);
    if (!f) continue;
    const baselineDays = Number(f.days_to_complete) || 0;
    const adjustedDays = baselineDays * mult;
    const featureHours = adjustedDays * hoursDay;
    const featureBasePrice = featureHours * rate;
    estimatedDays += adjustedDays;
    basePrice += featureBasePrice;
    totalsByFeature.push({
      id: f.id,
      name: f.name,
      complexity: f.complexity,
      baseline_days: baselineDays,
      adjusted_days: adjustedDays,
      feature_hours: featureHours,
      feature_base_price: featureBasePrice,
    });
  }

  const hasFeatures = totalsByFeature.length > 0;
  const estimatedHours = estimatedDays * hoursDay;

  let desiredDaysNum = parseInt(String(desiredDaysInput), 10);
  if (!hasFeatures || !Number.isFinite(desiredDaysNum) || desiredDaysNum <= 0) {
    desiredDaysNum = Math.max(1, Math.round(estimatedDays));
  }

  const effectiveDesiredDays = Math.max(
    1,
    Math.min(desiredDaysNum, Math.ceil(estimatedDays * maxTimeMult)),
  );

  let timeRatio = estimatedDays / effectiveDesiredDays;
  let effectiveRatio = Math.max(timeRatio, minPriceMult);

  const estimatedDaysRounded = Math.round(estimatedDays);
  if (desiredDaysNum === estimatedDaysRounded) {
    effectiveRatio = 1;
    timeRatio = 1;
  }

  let adjustedPrice = basePrice * effectiveRatio;

  totalsByFeature.forEach((row) => {
    row.feature_adjusted_price = row.feature_base_price * effectiveRatio;
  });

  const bufferFactor = 1 + bufferPercent / 100;
  if (bufferPercent > 0) {
    basePrice = basePrice * bufferFactor;
    adjustedPrice = adjustedPrice * bufferFactor;
    totalsByFeature.forEach((row) => {
      row.feature_base_price = row.feature_base_price * bufferFactor;
      row.feature_adjusted_price = (row.feature_adjusted_price ?? 0) * bufferFactor;
    });
  }

  return {
    estimated_days: estimatedDays,
    estimated_hours: estimatedHours,
    base_price: basePrice,
    effective_desired_days: effectiveDesiredDays,
    time_ratio: timeRatio,
    effective_ratio: effectiveRatio,
    adjusted_price: adjustedPrice,
    hasFeatures,
    totals_by_feature: totalsByFeature,
    bufferPercent,
  };
}

export function getFeatureBreakdown(
  selectedFeatureIds: string[],
  allFeatures: QuoteFeature[],
  options: GetTotalsOptions,
  bufferPercent = 0,
) {
  const result = getTotals(selectedFeatureIds, allFeatures, options, bufferPercent);
  return result.totals_by_feature.map((row) => ({
    id: row.id,
    name: row.name,
    complexity: row.complexity,
    adjusted_days: row.adjusted_days,
    feature_base_price: row.feature_base_price,
    feature_adjusted_price: row.feature_adjusted_price,
  }));
}
