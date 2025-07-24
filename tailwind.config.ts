import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Roboto Condensed',
          'JetBrains_Mono',
          'Helvetica Neue',
          'Arial',
          'system-ui',
          'sans-serif',
        ],
        body: [
          'Helvetica Neue', 
          'Arial', 
          'system-ui',
          'sans-serif',
        ],
        display: [
          'Roboto Condensed',
          'JetBrains_Mono',
          'Impact',
          'Helvetica Neue', 
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        strava: {
          orange: '#FC4C02',
          orangeLight: '#FF8A65',
          orangeDark: '#E34402',
          blue: '#2D87C3',
          blueLight: '#64B5F6',
          blueDark: '#1E5A86',
          gray: {
            100: '#F7F7FA',
            200: '#E5E5EA',
            300: '#D1D1D6',
            400: '#A8A8AD',
            500: '#5D5D5D',
            600: '#3A3A3A',
            700: '#242428',
            800: '#1A1A1D',
            900: '#121214',
          },
        },
      },
      backgroundImage: {
        'strava-gradient': 'linear-gradient(to right, #FC4C02, #FF8A65)',
        'strava-gradient-vertical': 'linear-gradient(to bottom, #FC4C02, #FF8A65)',
        'strava-blue-gradient': 'linear-gradient(to right, #2D87C3, #64B5F6)',
      },
      boxShadow: {
        'strava': '0 4px 6px -1px rgba(252, 76, 2, 0.1), 0 2px 4px -1px rgba(252, 76, 2, 0.06)',
        'strava-lg': '0 10px 15px -3px rgba(252, 76, 2, 0.1), 0 4px 6px -2px rgba(252, 76, 2, 0.05)',
      },
      borderRadius: {
        'strava': '4px',
      },
      spacing: {
        '72': '18rem', 
        '84': '21rem',
        '96': '24rem',
      },
      screens: {
        'xs': '480px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};

export default config;