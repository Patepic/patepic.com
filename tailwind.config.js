/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    borderRadius: {
      none: '0px',
      sm: '6px',
      DEFAULT: '6px',
      md: '6px',
      lg: '10px',
      xl: '10px',
      '2xl': '10px',
      '3xl': '16px',
      full: '9999px',
    },
    extend: {
      fontFamily: {
        display: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Token names kept as-is (pixel-forest/teal/mint/pink/blush/black/white)
        // so every existing Tailwind class site needs zero edits — only the
        // hex values changed, per the dark-theme brand palette below
        // (~55% #17151A / 20% #A51F36 / 12% #C93646 / 8% #C89A4B / 5% #F2E8E3):
        //   pixel-forest -> primary action red      (#C93646)
        //   pixel-teal   -> hairline borders/cream   (#F2E8E3, light-on-dark)
        //   pixel-mint   -> card/section fill        (#A51F36 dark crimson)
        //   pixel-pink   -> accent/CTA gold          (#C89A4B)
        //   pixel-blush  -> page background          (#17151A, dominant)
        //   pixel-black  -> ink/text                 (#F2E8E3, INVERTED: light text on dark bg)
        //   pixel-white  -> surface/card background  (#17151A, INVERTED: dark surface)
        'pixel-forest': '#C93646',
        'pixel-teal': '#F2E8E3',
        'pixel-mint': '#A51F36',
        'pixel-pink': '#C89A4B',
        'pixel-blush': '#17151A',
        'pixel-black': '#F2E8E3',
        'pixel-white': '#17151A',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        primary: { DEFAULT: '#C93646', foreground: '#F2E8E3' },
        secondary: { DEFAULT: '#17151A', foreground: '#C93646' },
        muted: { DEFAULT: '#A51F36', foreground: '#F2E8E3' },
        accent: { DEFAULT: '#C89A4B', foreground: '#17151A' },
        destructive: { DEFAULT: '#C93646', foreground: '#F2E8E3' },
        border: '#F2E8E3',
        input: '#F2E8E3',
        ring: '#C89A4B',
      },
      spacing: {
        '4.5': '18px',
        '13': '52px',
      },
      boxShadow: {
        // Shadows stay near-black regardless of theme (elevation shadows are
        // conventionally dark even on dark surfaces), using #17151A's rgb.
        'pixel-sm': '0 1px 2px 0 rgba(23, 21, 26, 0.35)',
        pixel: '0 6px 20px -6px rgba(23, 21, 26, 0.5)',
        'pixel-lg': '0 16px 40px -12px rgba(23, 21, 26, 0.6)',
        'pixel-pink': '0 6px 20px -6px rgba(23, 21, 26, 0.5)',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-up': 'fade-up 0.6s ease-out both',
        shimmer: 'shimmer 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};
