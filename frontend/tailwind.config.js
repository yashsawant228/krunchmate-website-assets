/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        // Teal palette (Salt & Vinegar) — default
        teal: {
          950: "#082D33",
          800: "#1A525F",
          600: "#30716C",
          400: "#3E9C93",
          ink: "#1D2528",
        },
        // Brown palette (Peanut Butter)
        brown: {
          950: "#2E1412",
          800: "#572F20",
          600: "#7D4124",
          500: "#9A4D22",
          300: "#CE7E59",
        },
        gold: "#F6A81E",
        cream: "#FFFBE5",
      },
      fontFamily: {
        display: ['"FuturaBkBT"', "sans-serif"],
        body: ['"Helvetica Neue"', "Helvetica", "Arial", "sans-serif"],
        beth: ['"BethEllen"', "cursive"],
        rusty: ['"RustyHooks"', "cursive"],
        hops: ['"HopsAndBarley"', "cursive"],
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
    },
  },
  plugins: [],
};
