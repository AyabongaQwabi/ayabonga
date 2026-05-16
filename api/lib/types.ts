export type FounderStage = 'idea' | 'mvp' | 'live' | 'rebuild';

export type QuoteFeatureLine = {
  name: string;
  adjustedDays: number;
  adjustedPriceZar: number;
};

export type QuotePayload = {
  projectTypes: string[];
  features: QuoteFeatureLine[];
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

export type SendQuoteRequestBody = {
  name: string;
  email: string;
  founderStage: FounderStage;
  projectDetails: string;
  quote: QuotePayload;
};
