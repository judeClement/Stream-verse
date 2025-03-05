module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
      extend: {
        fontFamily: {
          questrial: ["Questrial", "sans-serif"],
        },        
      },
  },
  plugins: [require('tailwind-scrollbar-hide')],
};
