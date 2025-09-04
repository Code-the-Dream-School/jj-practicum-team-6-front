
export default {
  content: ["./index.html",'./src/**/*.{js,jsx,ts,tsx}'], 
  theme: {
    extend: {
      colors: {
        'brand-orange': '#E66240',
        'brand-black': '#1E1E1E',
        'brand-gray': '#6F7273',
        'brand-light': '#F3F3F3',
        'brand-green': '#7FD96C',
      },
      fontFamily: {
        header: ['Merriweather', 'serif'],
        body: ['Roboto', 'sans-serif'],
        accent: ['Birthstone', 'cursive'],
      },
      borderRadius: {
        'lg': '14px',
      },
      boxShadow: {
        card: '0px 4px 12px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};