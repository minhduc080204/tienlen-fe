import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        card: ["TienLen", "system-ui", "sans-serif"],
      }
    },
  },
  plugins: [],
} satisfies Config;
