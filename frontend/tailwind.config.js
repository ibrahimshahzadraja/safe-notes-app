/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {darkGray: '#151316', lightGray: 'hsl(0, 0%, 30%)', mediumGray: 'hsl(0, 0%, 15%)'},
      boxShadow: {sh: '0 10px 15px rgba(50, 50, 50, 0.5)'}
    },
  },
  plugins: [],
}