import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// import JsonExcel from "vue-json-excel";

createApp(App)
	.use(router)
	.use(store)
	// .component("downloadExcel", JsonExcel)
	.mount("#app");
