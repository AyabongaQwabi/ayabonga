import type { MouseEvent, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { getLenis } from '../../lib/lenis';

type TransitionLinkProps = {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  /** When true, opens http(s) URLs in a new tab. Defaults to true for absolute URLs. */
  openInNewTab?: boolean;
};

function isExternalUrl(to: string): boolean {
  return /^https?:\/\//i.test(to);
}

function isBlogPostPath(path: string): boolean {
  return /^\/blog\/[^/]+\/?$/.test(path);
}

function normalizeInternalPath(path: string): string {
  const [pathname, search = '', hash = ''] = path.split(/(?=[?#])/);
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';
  return `${normalizedPath}${search}${hash}`;
}

export function TransitionLink({
  to,
  children,
  className,
  onClick,
  openInNewTab,
}: TransitionLinkProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const external = isExternalUrl(to);
  const newTab = openInNewTab ?? external;
  const targetPath = normalizeInternalPath(to);

  const completeNavigation = () => {
    if (external && newTab) {
      window.open(to, '_blank', 'noopener,noreferrer');
      return;
    }
    if (external) {
      window.location.assign(to);
      return;
    }

    const currentPath = normalizeInternalPath(
      `${location.pathname}${location.search}${location.hash}`,
    );
    const blogPostToBlogPost =
      isBlogPostPath(currentPath) && isBlogPostPath(targetPath);

    getLenis()?.scrollTo(0, { immediate: true });
    navigate(to);

    if (blogPostToBlogPost) {
      requestAnimationFrame(() => {
        const curtain = document.querySelector(
          '[data-page-curtain]',
        ) as HTMLElement | null;
        if (curtain) {
          gsap.set(curtain, { scaleY: 0, transformOrigin: 'top' });
        }
      });
    }
  };

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClick?.(e);

    const curtain = document.querySelector(
      '[data-page-curtain]',
    ) as HTMLElement | null;

    if (!curtain) {
      completeNavigation();
      return;
    }

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      completeNavigation();
      return;
    }

    gsap.to(curtain, {
      scaleY: 1,
      duration: 0.5,
      ease: 'power3.inOut',
      transformOrigin: 'bottom',
      onComplete: completeNavigation,
    });
  };

  return (
    <a
      href={to}
      onClick={handleClick}
      className={className}
      {...(newTab && external
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {})}
    >
      {children}
    </a>
  );
}
