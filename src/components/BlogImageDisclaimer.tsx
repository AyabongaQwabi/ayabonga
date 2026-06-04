import { WHATSAPP_URL } from '../lib/site-config';

/** Illustrative image sourcing notice on blog posts. */
export function BlogImageDisclaimer() {
  return (
    <aside
      className='not-prose mb-6 border-t border-border/60 pt-5'
      aria-label='Image disclaimer'
    >
      <p className='max-w-3xl text-xs leading-relaxed text-muted-foreground/90'>
        <strong className='font-medium text-muted-foreground'>
          Image Disclaimer
        </strong>
        : Hero images are royalty-free stock from{' '}
        <a
          href='https://www.pexels.com/license/'
          target='_blank'
          rel='noopener noreferrer'
          className='text-muted-foreground underline decoration-border underline-offset-2 transition-colors hover:text-foreground hover:decoration-primary/50'
        >
          Pexels
        </a>{' '}
        unless noted otherwise. Some older posts may use editorial images from
        public web search. They are illustrative only. If you are the copyright
        owner and want an image removed, please{' '}
        <a
          href={WHATSAPP_URL}
          target='_blank'
          rel='noopener noreferrer'
          className='text-muted-foreground underline decoration-border underline-offset-2 transition-colors hover:text-foreground hover:decoration-primary/50'
        >
          contact me
        </a>
        .
      </p>
    </aside>
  );
}
