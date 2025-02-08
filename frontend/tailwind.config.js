/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brightMagenta: "rgb(223,0,255)",
        deepMagenta: "rgb(180,0,200)",
        richPurple: "rgb(120,0,180)",
        darkViolet: "rgb(80,0,120)",
        nearBlack: "rgb(20,0,40)",
      },
      animation: {
        gradientMove: "gradientMove 6s infinite linear",
      },
      keyframes: {
        gradientMove: {
          "0%": { backgroundPosition: "0% 50%" },
          "25%": { backgroundPosition: "50% 75%" },
          "50%": { backgroundPosition: "100% 50%" },
          "75%": { backgroundPosition: "50% 25%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      backgroundSize: {
        "200%": "200% 200%",
      },
    },
  },
  plugins: [],
};
