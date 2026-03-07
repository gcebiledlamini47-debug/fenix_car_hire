import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1F3C88',
        secondary: '#00A8E8',
        accent: '#F4F6F9',
      },
      fontFamily: {
        sans: ['Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
