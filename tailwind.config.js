/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-quicksand)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      backgroundImage: {
        "love-gradient":
          "linear-gradient(to right, #f78ca0 0%, #f9748f 19%, #fd868c 60%, #fe9a8b 100%)",
      },
      keyframes: {
        expand: {
          "0%": { transform: "scale(0)", transformOrigin: "top left" },
          "100%": { transform: "scale(1)", transformOrigin: "top left" },
        },
      },
      animation: {
        expand: "expand 0.8s ease-out forwards",
      },
      colors: {
        love: {
          pink: "#ff4d6d",
          red: "#ff1e56",
        },
        primary: "#FD5169",
      },
    },
  },
  plugins: [],
};
