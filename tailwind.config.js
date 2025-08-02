export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        primary: '#2563eb', // blue-600
        accent: '#f59e42', // orange-400
      },
    },
  },
  plugins: [],
}; 