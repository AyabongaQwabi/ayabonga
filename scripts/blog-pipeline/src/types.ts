export type ImageKind =
  | 'screenshot'
  | 'ai-illustration'
  | 'infographic'
  | 'architecture-diagram'
  | 'flowchart'
  | 'comparison-graphic'
  | 'code-screenshot'
  | 'ui-composition';

export interface SectionImagePlan {
  sectionId: string;
  heading: string;
  kind: ImageKind;
  prompt?: string;
  screenshotTarget?: string;
  mermaidSource?: string;
  alt: string;
  caption?: string;
  filename: string;
}

export interface ArticleMetadata {
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  categories: string[];
  date: string;
  readTime: string;
  seoDescription: string;
  ogTitle: string;
  ogDescription: string;
  featured?: boolean;
  faq?: Array<{ question: string; answer: string }>;
  relatedSlugs?: string[];
  wordCount?: number;
}

export interface ArticleOutline {
  metadata: ArticleMetadata;
  sections: Array<{
    id: string;
    heading: string;
    level: 2 | 3;
    bullets: string[];
    imagePlan?: SectionImagePlan;
  }>;
}

export interface GeneratedArticle {
  metadata: ArticleMetadata;
  mdxBody: string;
  imagePlans: SectionImagePlan[];
  structuredData: Record<string, unknown>;
}

export interface ScreenshotTarget {
  id: string;
  name: string;
  url: string;
  viewport?: { width: number; height: number };
  darkMode?: boolean;
  fullPage?: boolean;
  scrollCapture?: boolean;
  waitMs?: number;
  gotoTimeoutMs?: number;
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit';
  cookieBannerSelectors?: string[];
}

export interface SocialPack {
  tweetThread: string[];
  linkedInPost: string;
  newsletterSummary: string;
}

export interface PipelinePaths {
  articleDir: string;
  mdxPath: string;
  markdownPath: string;
  metadataPath: string;
  imagesDir: string;
  diagramsDir: string;
  screenshotsDir: string;
  socialPath: string;
}
