import { App } from "vue";
import icons from "../theme/icons";

export const IconPlugin = {
  install: (app: App) => {
    app.provide("icons", icons);
  },
};
