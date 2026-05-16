import { Link } from 'react-router-dom';
import { ArrowRight, FileText } from 'lucide-react';
import type { BlogPost } from '../../data/blog-posts';
import { getPostThumbnail } from '../../data/blog-posts';
import { ScrollReveal } from '../ScrollReveal';

type HomeLatestWritingProps = {
  posts: BlogPost[];
};

export function HomeLatestWriting({ posts }: HomeLatestWritingProps) {
  if (posts.length === 0) return null;

  return (
    <ScrollReveal>
      <section
        id="writing"
        className="scroll-mt-24 border-t border-border py-20 md:py-28"
        aria-labelledby="writing-heading"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-technical text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                Writing
              </p>
              <h2
                id="writing-heading"
                className="mt-3 font-display text-mega-sm font-bold text-foreground"
              >
                Latest thinking
              </h2>
            </div>
            <Link
              to="/blog"
              className="interactive-link inline-flex shrink-0 items-center gap-2 font-technical text-sm font-semibold text-primary hover:underline underline-offset-4"
            >
              All posts
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <ul className="mt-12 grid gap-4 md:grid-cols-3">
            {posts.map((post) => {
              const thumb = getPostThumbnail(post);
              return (
                <li key={post.slug}>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="interactive-card group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/70"
                  >
                    {thumb ? (
                      <div className="aspect-[16/10] overflow-hidden border-b border-border/80 bg-secondary/40">
                        <img
                          src={thumb}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-[16/10] items-center justify-center border-b border-border/80 bg-secondary/40 text-primary/60">
                        <FileText className="h-10 w-10" aria-hidden />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <time
                        dateTime={post.date}
                        className="font-technical text-xs text-muted-foreground"
                      >
                        {post.date}
                      </time>
                      <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 flex-1 font-technical text-sm leading-relaxed text-muted-foreground">
                        {post.excerpt}
                      </p>
                      <span className="mt-4 font-technical text-xs font-semibold text-primary">
                        Read article
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </ScrollReveal>
  );
}
