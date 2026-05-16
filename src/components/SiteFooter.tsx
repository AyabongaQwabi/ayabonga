import { Link } from 'react-router-dom';
import { Brain, Calculator } from 'lucide-react';
import { SITE_NAME } from '../lib/site-config';
import { AUTHOR_JOB_TITLE } from '../lib/author-profile';

export function SiteFooter() {
  return (
    <footer className="border-t border-border py-8 mt-auto">
      <div className="max-w-5xl mx-auto px-6 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()} {SITE_NAME}. {AUTHOR_JOB_TITLE}.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <Link
              to="/about"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              to="/services"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Services
            </Link>
            <Link
              to="/blog"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Writing
            </Link>
            <Link
              to="/get-a-quote"
              className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              <Calculator className="w-3.5 h-3.5" aria-hidden />
              Quote
            </Link>
            <a
              href="/llms.txt"
              className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              <Brain className="w-3.5 h-3.5" aria-hidden />
              llms.txt
            </a>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground border-t border-border pt-4">
          <Link to="/privacy" className="hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link to="/editorial" className="hover:text-foreground transition-colors">
            Editorial standards
          </Link>
          <Link to="/corrections" className="hover:text-foreground transition-colors">
            Corrections
          </Link>
          <a
            href="https://github.com/ayabongaqwabi"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/ayabongaqwabi"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
