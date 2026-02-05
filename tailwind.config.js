/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary palette
        'warm-cream': '#F6F0D7',
        'soft-green': '#C5D89D',
        'sage': '#9CAB84',
        'dark-sage': '#89986D',
        
        // Legacy colors (for backward compatibility if needed)
        primary: '#030303',
        secondary: '#606060',
        light: '#f0f0f0',
        border: '#d3d3d3',
        blue: '#1d9bf0',
        'blue-dark': '#1a8cd8',
        'purple-primary': '#667eea',
        'purple-secondary': '#764ba2',
      },
      fontFamily: {
        'sans': ['Inter', 'Poppins', 'DM Sans', 'system-ui', 'sans-serif'],
      },
      aspectRatio: {
        'video': '16 / 9',
      },
      borderRadius: {
        'card': '16px',
        'button': '12px',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.06)',
      },
      spacing: {
        'gutter': '1.5rem',
      },
    },
  },
  plugins: [],
}
