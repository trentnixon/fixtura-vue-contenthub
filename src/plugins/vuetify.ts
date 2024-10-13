// src/plugins/vuetify.ts

import "vuetify/styles";
import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";

// Define the custom theme with color variants
const myTheme = {
  dark: false,
  colors: {
    background: "#FFFFFF", // white
    primary: "#182433", // teal darken-1
    "primary-lighten1": "#3a4a5b", // Example lightened primary
    "primary-darken1": "#0f1b25", // Example darkened primary
    secondary: "#3a3f55", // teal lighten-2
    "secondary-lighten1": "#5a6075",
    "secondary-darken1": "#2a2c45",
    accent: "#36799a", // deep orange lighten-1 (coral)
    "accent-lighten1": "#569ab5",
    "accent-darken1": "#245b7a",
    error: "#A9406C", // red darken-2
    "error-lighten1": "#c86a8f",
    "error-darken1": "#8c304c",
    warning: "#FF8D3E", // orange darken-1
    "warning-lighten1": "#ffb166",
    "warning-darken1": "#cc6a29",
    info: "#EEE8A9", // teal lighten-2
    "info-lighten1": "#f3f2c9",
    "info-darken1": "#d4d49c",
    success: "#61B29D", // teal lighten-3
    "success-lighten1": "#82c7b6",
    "success-darken1": "#3d9272",

    surface: "#e0dede", // light grey
    cardNeutral: "#fafafa", // white
    carderror: "#a9406c", // error color
    cardwarning: "#ff8d3e", // warning color
    cardinfo: "#f3f2c9", // info color
    cardsuccess: "#6baa75ff", // success color
    cta1: "#3a3f55",
    header1: "#f7f9ff",
  },
};

// Create and export the Vuetify instance
const vuetify = createVuetify({
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: "myTheme", // Set the custom theme as the default theme
    themes: {
      myTheme, // Register the custom theme
    },
  },
});

export default vuetify;
