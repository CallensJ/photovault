// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        mainBg: '#282c34',
        navbarBg: '#16171b',
        userSettingsBg: '#656667',
        signupBorder: '#f9572a',
        signupGradientStart: '#f9572a',
        signupGradientEnd: '#ffc905',
      },
    },
  },
  plugins: [],
};

export default config;
