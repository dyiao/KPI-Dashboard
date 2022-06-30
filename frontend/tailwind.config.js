module.exports = {

  darkMode: 'class',
  content: [
    "./src/**/*.{js, jsx, ts, tsx}",
    "./src/**/**/*.{js, jsx, ts, tsx}",
    "./src/*.{js, jsx, ts, tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          900: '#202225', 700: "#36393f", 800: "#272a2e"
        },
        navy: {
          900: "#02375e", 800: "#034f8a"
        },
        lightb: {
          100: "#f1f5f9"
        },
        predictions: {
          upset: "#8f00ff", warning: "#001aff", correct: "#00ff19"


        }
      }
    },
    fontFamily: {
      sans: ['sans-serif']
    }
  },
  plugins: [],
}