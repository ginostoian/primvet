import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          100: "#DCE6F0",
          700: "#1E4D7B",
          800: "#143A5E",
          900: "#0A2540",
        },
        brand: {
          600: "#2948D9",
          700: "#2038B8",
        },
        ink: "#0A2540",
        slate: {
          400: "#9AAAB8",
          600: "#5A6B7B",
        },
        cloud: "#F4F7FA",
        lavender: "#E5E8F4",
        mint: { 300: "#A8E0CE", 500: "#5FC9A8" },
        rose: { 300: "#F6C9C9", 500: "#E98B8B" },
        blue: { 300: "#BBD7F0", 500: "#5B9BD5" },
        green: { 300: "#BFE3A8", 500: "#6FB23F" },
        success: "#2E9E5B",
        warning: "#E0A23B",
        danger: "#D64545",
        info: "#3B82C4",
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      borderRadius: {
        sm: "8px",
        DEFAULT: "12px",
        md: "16px",
        lg: "20px",
        xl: "24px",
        "2xl": "32px",
        pill: "9999px",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(10, 37, 64, 0.06)",
        card: "0 8px 24px rgba(10, 37, 64, 0.08)",
        lift: "0 16px 40px rgba(10, 37, 64, 0.12)",
        focus: "0 0 0 3px rgba(95, 201, 168, 0.45)",
      },
      fontSize: {
        xs: ["0.75rem", "1.1rem"],
        sm: ["0.875rem", "1.35rem"],
        base: ["1rem", "1.6rem"],
        lg: ["1.125rem", "1.7rem"],
        xl: ["1.375rem", "1.85rem"],
        "2xl": ["1.75rem", "2.1rem"],
        "3xl": ["2.25rem", "2.5rem"],
        "4xl": ["2.875rem", "3.1rem"],
        "5xl": ["3.5rem", "3.7rem"],
      },
      maxWidth: { content: "1200px" },
      spacing: { section: "5rem", "section-lg": "7rem" },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
