/**
 * Developer quote tool — pricing & behaviour configuration.
 * Ported from quote-tool-oss `config.js`.
 */

export const HOURS_PER_DAY = 8;

/** Default for developer-oriented tooling (e.g. DevQuote). */
export const DEFAULT_HOURLY_RATE_ZAR = 1000;

/** Founder-facing estimator on /get-a-quote (fixed assumptions in page copy). */
export const CLIENT_QUOTE_HOURLY_RATE_ZAR = 300;
export const CLIENT_QUOTE_HOURS_PER_DAY = 4;
export const CLIENT_QUOTE_YEARS_EXPERIENCE = 10;
export const CLIENT_QUOTE_BUFFER_PERCENT = 10;

export const MIN_PRICE_MULTIPLIER = 0.4;

export const MAX_DESIRED_TIME_MULTIPLIER = 3;

export const EXPERIENCE_BASELINE_YEARS = 7;

export const EXPERIENCE_MULTIPLIER_MIN = 0.7;

export const EXPERIENCE_MULTIPLIER_MAX = 1.5;

export const EXPERIENCE_SLOPE = 0.05;

export const EXPERIENCE_INTERCEPT = 1.5;

export const BUFFER_PERCENT_OPTIONS = [0, 10, 20] as const;

export const CURRENCY_OPTIONS = [
  { code: 'ZAR', label: 'ZAR', rateToZar: 1 },
  { code: 'USD', label: 'USD', rateToZar: 0.055 },
  { code: 'EUR', label: 'EUR', rateToZar: 0.05 },
] as const;

export const pricingConfig = {
  HOURS_PER_DAY,
  DEFAULT_HOURLY_RATE_ZAR,
  CLIENT_QUOTE_HOURLY_RATE_ZAR,
  CLIENT_QUOTE_HOURS_PER_DAY,
  CLIENT_QUOTE_YEARS_EXPERIENCE,
  CLIENT_QUOTE_BUFFER_PERCENT,
  MIN_PRICE_MULTIPLIER,
  MAX_DESIRED_TIME_MULTIPLIER,
  EXPERIENCE_BASELINE_YEARS,
  EXPERIENCE_MULTIPLIER_MIN,
  EXPERIENCE_MULTIPLIER_MAX,
  EXPERIENCE_SLOPE,
  EXPERIENCE_INTERCEPT,
  BUFFER_PERCENT_OPTIONS,
  CURRENCY_OPTIONS,
} as const;

export default pricingConfig;
