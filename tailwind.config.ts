import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#0A231C",      // Dark Forest Green (Trust/Stability)
          deep: "#133D31",         // Deep Forest Green (Sleek depth)
          accent: "#C5A880",       // Sand Gold (Sophisticated point)
          gold: "#C5A880",         // Sand Gold (Unified point)
          lightGold: "#E2CBB0",    // Soft Sand Gold (Glow/Active)
          ivory: "#F7F5F0",        // Warm Sand Off-White (Soothing background)
          white: "#FFFFFF",
          charcoal: "#1C2421",     // Deep Charcoal Forest (Readable dark text)
          muted: "#606F69",        // Soft Forest Muted (Subtle captions)
          line: "#E6E2D8",         // Warm Sand Border Line (Clean partitions)
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
