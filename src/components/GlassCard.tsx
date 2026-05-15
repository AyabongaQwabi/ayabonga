import React from 'react';

type GlassVariant = 'default' | 'dark' | 'gold' | 'emerald';
type GlowVariant = 'none' | 'primary' | 'accent';

interface GlassCardProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: GlassVariant;
  glow?: GlowVariant;
  hover?: boolean;
  /** Render as a different element, e.g. 'article', 'section'. Defaults to 'div'. */
  as?: React.ElementType;
}

const variantClass: Record<GlassVariant, string> = {
  default: 'glass',
  dark: 'glass-dark',
  gold: 'glass-gold',
  emerald: 'glass-emerald',
};

const glowClass: Record<GlowVariant, string> = {
  none: '',
  primary: 'glow-primary',
  accent: 'glow-accent',
};

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'default',
  glow = 'none',
  className = '',
  hover = false,
  as: Tag = 'div',
  ...rest
}) => {
  const hoverClasses = hover
    ? 'transition-all duration-500 hover:-translate-y-1 cursor-pointer'
    : '';

  return (
    <Tag
      className={[
        'rounded-xl p-6',
        variantClass[variant],
        glowClass[glow],
        hoverClasses,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default GlassCard;
