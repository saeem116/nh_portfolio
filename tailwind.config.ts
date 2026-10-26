import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#080808",
        "ink-soft": "#0d0d0d",
        panel: "#111111",
        line: "#1f1f1f",
        "line-soft": "#161616",
        red: "#e50920",
        "red-soft": "#ff2a3d",
        "red-glow": "rgba(229, 9, 32, 0.18)",
        text: "#f4f4f4",
        "text-soft": "#c9c9c9",
        muted: "#7a7a7a",
        "muted-soft": "#555555",
      },
      fontFamily: {
        display: ["Anton", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
        script: ["Dancing Script", "cursive"],
      },
    },
  },
  plugins: [],
};

export default config;