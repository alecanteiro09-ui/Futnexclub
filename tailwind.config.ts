import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#0A0B0D", // fundo principal, quase preto
          soft: "#131519",     // fundo de cards
          border: "#22252B",
        },
        ink: {
          DEFAULT: "#F5F6F7", // branco principal
          muted: "#9CA1AA",   // cinza texto secundário
        },
        accent: {
          DEFAULT: "#3355FF", // azul "luz de estádio" — cor de CTA/energia
          dim: "#2542CC",
          soft: "#1A2452",
        },
        gold: {
          DEFAULT: "#E8B84B", // dourado "campeão" — badges premium (mais vendida)
          dim: "#C79A34",
        },
        success: "#3FE07A",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        card: "0 8px 30px -12px rgba(0,0,0,0.6)",
      },
    },
  },
  plugins: [],
};
export default config;
