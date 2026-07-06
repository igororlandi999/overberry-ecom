import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        plum: { 950: "#1A0817", 900: "#22091F" },
        magenta: { DEFAULT: "#B83A82", soft: "#9B2D6F" },
        purple: {
          900: "#2A0E26",
          700: "#4A1942",
          600: "#6B2D5C",
          500: "#8A3D77",
          200: "#D9BFD2",
          100: "#EDDDE8",
        },
        green: {
          700: "#2F5E45",
          500: "#4E9A6F",
          100: "#DEEFE5",
        },
        cream: "#FAF6F2",
        ink: { DEFAULT: "#1F141C", soft: "#5C4F57" },
        line: "#E8E0E4",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(31,20,28,0.06)",
        md: "0 8px 24px rgba(31,20,28,0.08)",
        plum: "0 24px 60px -24px rgba(26,8,23,0.65)",
        glow: "0 0 80px -10px rgba(184,58,130,0.45)",
      },
      keyframes: {
        floaty: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
      },
      animation: { floaty: "floaty 7s ease-in-out infinite" },
      maxWidth: {
        content: "1120px",
        prose: "680px",
      },
    },
  },
  plugins: [],
};
export default config;
