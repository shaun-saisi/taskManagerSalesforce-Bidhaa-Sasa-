module.exports = {
    presets: [
      '@babel/preset-env',  // Transpiles modern JavaScript to compatible code
      '@babel/preset-react', // If you're using React (optional for LWC)
    ],
    plugins: ['@babel/plugin-transform-runtime'], // For efficient handling of async/await and other features
  };
  