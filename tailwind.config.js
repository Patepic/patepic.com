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
        // 5 named colors, one per brand hex — dark theme:
        //   surface  #17151A  near-black, ~55%, page/card background
        //   crimson  #A51F36  dark red,   ~20%, section/card fills
        //   scarlet  #C93646  bright red, ~12%, primary action color
        //   gold     #C89A4B  gold,        ~8%, accent/CTA color
        //   ink      #F2E8E3  cream,       ~5%, text + hairline borders
        surface: '#17151A',
        crimson: '#A51F36',
        scarlet: '#C93646',
        gold: '#C89A4B',
        ink: '#F2E8E3',
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
        'soft-sm': '0 1px 2px 0 rgba(23, 21, 26, 0.35)',
        soft: '0 6px 20px -6px rgba(23, 21, 26, 0.5)',
        'soft-lg': '0 16px 40px -12px rgba(23, 21, 26, 0.6)',
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
