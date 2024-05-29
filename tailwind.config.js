/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#B14F09',
        secundary: '#2C5282',
        hoverSecundary: '#2C5282',
        'custom-bg': '#E3FEE7',
      },
    },
  },
  plugins: [],
}
