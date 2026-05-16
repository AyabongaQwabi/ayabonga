import { useCallback, useState } from 'react';
import { Check, Link2, Linkedin, MessageCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { absoluteUrl } from '../lib/site-config';

export interface BlogShareProps {
  /** Canonical article URL path (`/blog/slug`) or absolute URL. */
  url: string;
  title: string;
  className?: string;
  /** Short label above buttons (default: "Share"). */
  label?: string;
}

function resolveShareUrl(url: string): string {
  return /^https?:\/\//i.test(url) ? url : absoluteUrl(url);
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function buildShareLinks(shareUrl: string, title: string) {
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const whatsappText = encodeURIComponent(`${title} ${shareUrl}`);

  return {
    linkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${whatsappText}`,
  };
}

export function BlogShare({
  url,
  title,
  className,
  label = 'Share',
}: BlogShareProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = resolveShareUrl(url);
  const links = buildShareLinks(shareUrl, title);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement('textarea');
      input.value = shareUrl;
      input.setAttribute('readonly', '');
      input.style.position = 'absolute';
      input.style.left = '-9999px';
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }, [shareUrl]);

  const iconButtonClass =
    'h-10 w-10 rounded-xl border border-border bg-background/50 text-muted-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-primary motion-safe:transition-colors motion-reduce:transition-none';

  return (
    <section
      className={cn(
        'not-prose rounded-2xl border border-border bg-card/60 p-4 sm:p-5',
        className,
      )}
      aria-labelledby="blog-share-heading"
    >
      <h2
        id="blog-share-heading"
        className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
      >
        {label}
      </h2>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className={iconButtonClass}
          asChild
        >
          <a
            href={links.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on LinkedIn"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        </Button>

        <Button
          variant="outline"
          size="icon"
          className={iconButtonClass}
          asChild
        >
          <a
            href={links.x}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on X"
          >
            <XIcon className="h-4 w-4" />
          </a>
        </Button>

        <Button
          variant="outline"
          size="icon"
          className={iconButtonClass}
          asChild
        >
          <a
            href={links.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on WhatsApp"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className={cn(
            iconButtonClass,
            copied && 'border-primary/50 text-primary',
          )}
          onClick={() => void copyLink()}
          aria-label={copied ? 'Link copied' : 'Copy link'}
        >
          {copied ? (
            <Check className="h-4 w-4" aria-hidden />
          ) : (
            <Link2 className="h-4 w-4" aria-hidden />
          )}
        </Button>
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {copied ? 'Link copied to clipboard' : ''}
      </p>
    </section>
  );
}
