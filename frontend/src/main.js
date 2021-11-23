import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import PrimeVue from "primevue/config";
import Dialog from "primevue/dialog"; //! Exemple
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Password from "primevue/password";
import Card from "primevue/card";
import OverlayPanel from "primevue/overlaypanel";
import Dropdown from "primevue/dropdown";
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";
import Badge from "primevue/badge";
import BadgeDirective from "primevue/badgedirective";

// import JsonExcel from "vue-json-excel";
import "primeicons/primeicons.css"; //icons
import "primeflex/primeflex.css"; // grid system
import "primevue/resources/primevue.min.css"; //core css
import "primevue/resources/themes/saga-green/theme.css"; //theme
// import "primevue/resources/themes/rhea/theme.css"; //theme

createApp(App)
	.use(router)
	.use(store)
	.use(PrimeVue, {
		locale: {
			weak: "Faible",
			medium: "Moyen",
			strong: "Fort",
			passwordPrompt: "Saisir un mot de passe",
		},
	})
	.component("Dialog", Dialog) //! Exemple
	.component("InputText", InputText)
	.component("Button", Button)
	.component("Password", Password)
	.component("Card", Card)
	.component("OverlayPanel", OverlayPanel)
	.component("Dropdown", Dropdown)
	.use(ToastService)
	.component("Toast", Toast)
	.directive("badge", BadgeDirective)
	.component("Badge", Badge)

	// .component("downloadExcel", JsonExcel)
	.mount("#app");
