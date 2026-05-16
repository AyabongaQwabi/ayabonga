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
        : The images used in this blog post were sourced from public Google
        searches. I do not own the rights to these images. They are used for
        illustrative and educational purposes only under fair use principles. If
        you are the copyright owner and would like an image removed, please{' '}
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
