import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      width: {
        'site': '1300px', // Custom width value
        'halfsite': '680px', // Custom width value
        '3/4site': '950px'
      },
    },
  },
  plugins: [],
} satisfies Config;
