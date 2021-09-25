import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
// import JsonExcel from "vue-json-excel";

createApp(App)
	.use(router)
	// .component("downloadExcel", JsonExcel)
	.mount("#app");
