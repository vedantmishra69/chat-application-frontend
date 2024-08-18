/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [],
  theme: {
    extend: {
      colors: {
        'custom-purple': '#8e44ad',
        'custom-blue': '#3498db',
      }
    }
  },
}

