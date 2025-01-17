module.exports = {
    plugins: [
      require('postcss-import'), // Allows you to use @import in your CSS
      require('tailwindcss'),     // Include Tailwind CSS
      require('autoprefixer'),    // Adds vendor prefixes to CSS rules
      require('postcss-scrollbar-hide'), // Example of another plugin, if needed
    ],
  };
  