export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#E66240",
        ink: "#1E1E1E",
        gray600: "#6F7273",
        gray100: "#F3F3F3",
        success: "#7FD96C",
      },
      fontFamily: {
        display: ["Merriweather", "serif"],
        body: ["Roboto", "ui-sans-serif", "system-ui"],
        script: ["Birthstone", "cursive"],
      },
      borderRadius: {
        14: "14px",
      },
      boxShadow: {
        card: "0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -4px rgba(0,0,0,.1)",
      },
    },
  },
  plugins: [],
};
