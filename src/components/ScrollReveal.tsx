import {
  Children,
  cloneElement,
  isValidElement,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cn } from '../lib/utils';
import { useScrollReveal, type UseScrollRevealOptions } from '../hooks/useScrollReveal';

type ScrollRevealProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** Stagger direct children via CSS --reveal-index */
  stagger?: boolean;
  observerOptions?: UseScrollRevealOptions;
};

export function ScrollReveal({
  children,
  className,
  stagger = false,
  observerOptions,
  ...props
}: ScrollRevealProps) {
  const ref = useScrollReveal<HTMLDivElement>(observerOptions);

  const content = stagger
    ? Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child;
        const el = child as ReactElement<{ style?: CSSProperties }>;
        return cloneElement(el, {
          style: {
            ...el.props.style,
            ['--reveal-index' as string]: index,
          },
        });
      })
    : children;

  return (
    <div
      ref={ref}
      className={cn(stagger ? 'reveal-stagger' : 'reveal', className)}
      {...props}
    >
      {content}
    </div>
  );
}
