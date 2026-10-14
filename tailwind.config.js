module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    borderRadius: {
      none: "0px",
      sm: "3px",
      DEFAULT: "3px",
      md: "4px",
      lg: "4px",
      xl: "6px",
      "2xl": "8px",
      "3xl": "12px",
      full: "9999px",
    },
    extend: {
      lineHeight: {
        relaxed: "round(1.625em, 1px)",
      },
      fontFamily: {
        display: ['"Nunito"', "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ['"Nunito"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        "charcoal-brown": "color-mix(in srgb, var(--color-charcoal-brown) calc(<alpha-value> * 100%), transparent)",
        "white": "color-mix(in srgb, var(--color-soft-white) calc(<alpha-value> * 100%), transparent)",
        "straw": "color-mix(in srgb, var(--color-straw) calc(<alpha-value> * 100%), transparent)",
        "honey": "color-mix(in srgb, var(--color-honey) calc(<alpha-value> * 100%), transparent)",
        "mango-yellow": "color-mix(in srgb, var(--color-mango-yellow) calc(<alpha-value> * 100%), transparent)",
        "cream-yellow": "color-mix(in srgb, var(--color-cream-yellow) calc(<alpha-value> * 100%), transparent)",
        "gold": "color-mix(in srgb, var(--color-gold) calc(<alpha-value> * 100%), transparent)",
        "sky": "color-mix(in srgb, var(--color-sky) calc(<alpha-value> * 100%), transparent)",
        "pink": "color-mix(in srgb, var(--color-pink) calc(<alpha-value> * 100%), transparent)",
        "pink-dusty": "color-mix(in srgb, var(--color-pink-dusty) calc(<alpha-value> * 100%), transparent)",
        "pink-soft": "color-mix(in srgb, var(--color-pink-soft) calc(<alpha-value> * 100%), transparent)",
        "blush": "color-mix(in srgb, var(--color-blush) calc(<alpha-value> * 100%), transparent)",
        "chestnut-brown": "color-mix(in srgb, var(--color-chestnut-brown) calc(<alpha-value> * 100%), transparent)",
        "tier-ink": "color-mix(in srgb, var(--color-tier-ink) calc(<alpha-value> * 100%), transparent)",
        background: "color-mix(in srgb, var(--color-soft-white) calc(<alpha-value> * 100%), transparent)",
        foreground: "color-mix(in srgb, var(--color-charcoal-brown) calc(<alpha-value> * 100%), transparent)",
        popover: { DEFAULT: "color-mix(in srgb, var(--color-soft-white) calc(<alpha-value> * 100%), transparent)", foreground: "color-mix(in srgb, var(--color-charcoal-brown) calc(<alpha-value> * 100%), transparent)" },
        muted: { DEFAULT: "color-mix(in srgb, var(--color-straw) calc(<alpha-value> * 100%), transparent)", foreground: "color-mix(in srgb, var(--color-charcoal-brown) 68%, transparent)" },
        accent: { DEFAULT: "color-mix(in srgb, var(--color-mango-yellow) calc(<alpha-value> * 100%), transparent)", foreground: "color-mix(in srgb, var(--color-charcoal-brown) calc(<alpha-value> * 100%), transparent)" },
        destructive: { DEFAULT: "color-mix(in srgb, var(--color-charcoal-brown) calc(<alpha-value> * 100%), transparent)", foreground: "color-mix(in srgb, var(--color-soft-white) calc(<alpha-value> * 100%), transparent)" },
        input: "color-mix(in srgb, var(--color-honey) calc(<alpha-value> * 100%), transparent)",
        ring: "color-mix(in srgb, var(--color-charcoal-brown) calc(<alpha-value> * 100%), transparent)",
      },
      spacing: {
        "4.5": "18px",
        "13": "52px",
      },
      boxShadow: {
        soft: "0 10px 28px -12px color-mix(in srgb, var(--color-charcoal-brown) 55%, transparent)",
      },
      keyframes: {
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
      animation: {
        shimmer: "shimmer 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
