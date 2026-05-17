import { Music } from 'lucide-react';
import { TransitionLink } from './ui/TransitionLink';

const ESPAZZA_TAG = 'espazza';

export function postMentionsEspazza(tags: string[]): boolean {
  return tags.some((t) => t.toLowerCase().replace(/\s+/g, '') === ESPAZZA_TAG);
}

/** Shown on blog posts tagged eSpazza while the music site is offline. */
export default function EspazzaStatusBanner() {
  return (
    <aside
      className="not-prose mb-8 rounded-xl border border-amber-500/25 bg-amber-500/5 px-4 py-3"
      aria-label="eSpazza site status"
    >
      <div className="flex gap-3">
        <Music className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden />
        <div>
          <p className="text-sm font-medium text-foreground mb-1">eSpazza is temporarily offline</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            I built eSpazza (Xhosa hip hop streaming). The public site at xhosahiphop.co.za is down
            while we restore hosting.{' '}
            <TransitionLink
              to="/projects/espazza"
              className="text-primary hover:underline font-medium"
            >
              Status and contact
            </TransitionLink>
          </p>
        </div>
      </div>
    </aside>
  );
}
