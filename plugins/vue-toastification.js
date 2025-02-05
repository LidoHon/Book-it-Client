import { defineNuxtPlugin } from "#app";
import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/theme-default.css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueToast.install ? VueToast : VueToast.install);
});
