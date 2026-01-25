/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: {
          dark: "#1b1b1b",
          charcoal: "#2f2f2f",
        },
        accent: {
          primary: "#f54703",
          secondary: "#ff7518",
          glow: "#FD8B5D",
          soft: "#FFC299",
        },
      },
      fontFamily: {
        display: ["Bricolage Grotesque", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 30px rgba(245, 71, 3, 0.4)",
      },
    },
  },
  plugins: [],
}

