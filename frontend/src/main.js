import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import PrimeVue from "primevue/config";
import Dialog from "primevue/dialog"; //! Exemple
import InputText from "primevue/inputtext";

// import JsonExcel from "vue-json-excel";
import "primeicons/primeicons.css"; //icons
import "primeflex/primeflex.css"; // grid system
import "primevue/resources/primevue.min.css"; //core css
// import "primevue/resources/themes/saga-green/theme.css"; //theme
import "primevue/resources/themes/md-light-deeppurple/theme.css"; //theme

createApp(App)
	.use(router)
	.use(store)
	.use(PrimeVue)
	.component("Dialog", Dialog) //! Exemple
	.component("InputText", InputText)

	// .component("downloadExcel", JsonExcel)
	.mount("#app");
