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
        // hex values changed, per the new brand palette below:
        //   pixel-forest -> primary/action red   (#D91E2D)
        //   pixel-teal   -> structural neutral    (#2D2D2D)
        //   pixel-mint   -> soft section tint     (#DBBFA2)
        //   pixel-pink   -> accent/CTA gold       (#D4AF37)
        //   pixel-blush  -> page background wash  (#F0F0F0)
        //   pixel-black  -> ink/text/borders      (#121212)
        //   pixel-white  -> surface/card bg       (#F0F0F0)
        'pixel-forest': '#D91E2D',
        'pixel-teal': '#2D2D2D',
        'pixel-mint': '#DBBFA2',
        'pixel-pink': '#D4AF37',
        'pixel-blush': '#F0F0F0',
        'pixel-black': '#121212',
        'pixel-white': '#F0F0F0',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        primary: { DEFAULT: '#D91E2D', foreground: '#F0F0F0' },
        secondary: { DEFAULT: '#F0F0F0', foreground: '#D91E2D' },
        muted: { DEFAULT: '#DBBFA2', foreground: '#D91E2D' },
        accent: { DEFAULT: '#D4AF37', foreground: '#121212' },
        destructive: { DEFAULT: '#D91E2D', foreground: '#F0F0F0' },
        border: '#2D2D2D',
        input: '#2D2D2D',
        ring: '#D4AF37',
      },
      spacing: {
        '4.5': '18px',
        '13': '52px',
      },
      boxShadow: {
        'pixel-sm': '0 1px 2px 0 rgba(18, 18, 18, 0.06)',
        pixel: '0 6px 20px -6px rgba(18, 18, 18, 0.18)',
        'pixel-lg': '0 16px 40px -12px rgba(18, 18, 18, 0.22)',
        'pixel-pink': '0 6px 20px -6px rgba(18, 18, 18, 0.18)',
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
