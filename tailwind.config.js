/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    // デフォルトブレークポイントを使用:
    // md: 768px (タブレット)
    // lg: 1024px (デスクトップ)
    // xl: 1280px (大画面デスクトップ)
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3f51b5',  // Indigo
          light: '#757de8',
          dark: '#002984',
        },
        secondary: {
          DEFAULT: '#f50057',  // Pink
          light: '#ff5983',
          dark: '#bb002f',
        },
        background: {
          DEFAULT: '#121212',  // ダークグレー
          paper: '#1e1e1e',    // カード背景
        },
      },
    },
  },
  plugins: [],
}
