// eslint-disable-next-line no-undef
module.exports = {
  mode: "jit",
  media: false,
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      montserrat: ["Montserrat"],
    },
    colors: {
      transparent: "transparent",
      white: "white",
      black: "black",
      primary: "#0A3764",
      secondary: "#51AA1C",
      error: "#DA1414",
      disabledButton: "#DADEE3",
      buttonBorder: "#7d8b94",
      lightGreen: "#d6efdc",
      deepBlue: "#29465c",
      secondaryBlack: "#303331",
      lightRed: "#ed9d9d",
    },
    extend: {},
    plugins: [],
  },
};
