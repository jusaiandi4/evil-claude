import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ember: {
          50: "#fff4ee",
          100: "#ffe6d5",
          200: "#ffc9aa",
          300: "#ffa274",
          400: "#ff7a3d",
          500: "#ff5c1a",
          600: "#f04a0c",
          700: "#c73807",
          800: "#9e2e0c",
          900: "#7f290e",
        },
        coal: {
          950: "#0b0c10",
          900: "#101014",
          850: "#121216",
          800: "#16171c",
          700: "#1c1d23",
          600: "#24252c",
          500: "#2e3038",
        },
        star: {
          blue: "#7ab8f5",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 60px -12px rgba(255, 92, 26, 0.45)",
        "glow-sm": "0 0 24px -6px rgba(255, 92, 26, 0.35)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.35s ease-out both",
        "glow-pulse": "glow-pulse 3.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
