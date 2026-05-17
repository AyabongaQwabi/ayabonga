/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      borderColor: {
        DEFAULT: "hsl(var(--border))",
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Clash Display"', 'Outfit', 'system-ui', 'sans-serif'],
        technical: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        mega: ['clamp(3.25rem,11vw,7.5rem)', { lineHeight: '0.92', letterSpacing: '-0.04em' }],
        'mega-sm': ['clamp(2.5rem,8vw,5rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        manifesto: ['clamp(1.75rem,4.5vw,3.25rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-xl': ['clamp(2.75rem, 11vw, 15rem)', { lineHeight: '0.88', letterSpacing: '-0.04em' }],
        'display-lg': ['clamp(52px, 9vw, 140px)', { lineHeight: '0.92', letterSpacing: '-0.03em' }],
        'display-md': ['clamp(36px, 5.5vw, 88px)', { lineHeight: '1.0', letterSpacing: '-0.02em' }],
        'heading-lg': ['clamp(26px, 3.5vw, 52px)', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        'heading-md': ['clamp(20px, 2.5vw, 36px)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'label-sm': ['clamp(10px, 1.1vw, 13px)', { lineHeight: '1.4', letterSpacing: '0.15em' }],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(1rem)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-up': 'fade-up 0.5s var(--motion-ease-out, ease-out) forwards',
      },
    },
  },
  plugins: [],
};
