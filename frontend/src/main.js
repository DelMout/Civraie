import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import PrimeVue from "primevue/config";
import Dialog from "primevue/dialog";
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
import ProgressSpinner from "primevue/progressspinner";
import Editor from "primevue/editor";
import Textarea from "primevue/textarea";
import ConfirmationService from "primevue/confirmationservice";
import ConfirmPopup from "primevue/confirmpopup";
import Checkbox from "primevue/checkbox";
import Vue3TouchEvents from "vue3-touch-events";

import "primeicons/primeicons.css"; //icons
import "primeflex/primeflex.css"; // grid system
import "primevue/resources/primevue.min.css"; //core css
import "primevue/resources/themes/saga-green/theme.css"; //theme

createApp(App)
	.use(router)
	.use(store)
	.use(PrimeVue, {
		locale: {
			weak: "Faible",
			medium: "Moyen",
			strong: "Fort",
			passwordPrompt: "Saisir un mot de passe",
			accept: "OK",
			reject: "Non",
		},
	})
	.use(Vue3TouchEvents)
	.use(ConfirmationService)
	.component("Dialog", Dialog)
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
	.component("ProgressSpinner", ProgressSpinner)
	.component("Editor", Editor)
	.component("Textarea", Textarea)
	.component("ConfirmPopup", ConfirmPopup)
	.component("Checkbox", Checkbox)

	.mount("#app");
