import { createRouter, createWebHistory } from "vue-router";
import Signup from "../views/Signup.vue";
import NotFound from "../views/NotFound.vue";

const routes = [
	{
		path: "/",
		name: "Signup",
		component: Signup,
		meta: {
			title: "Ferme La Civraie",
		},
	},
	{
		path: "/about",
		name: "About",
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ "../views/About.vue"),
		meta: {
			title: "Ferme La Civraie / About",
		},
	},
	{
		path: "/:pathMatch(.*)",
		name: "NotFound",
		component: NotFound,
		meta: {
			title: "404 Not Found",
		},
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

router.afterEach((to) => {
	document.title = to.meta.title;
});

export default router;
