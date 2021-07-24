import { createRouter, createWebHistory } from "vue-router";
import Signup from "../views/Signup.vue";
import Password from "../views/Password.vue";
import ProdShop from "../views/ProdShop.vue";
import ProdOrder from "../views/ProdOrder.vue";
import Products from "../views/Products.vue";
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
		path: "/setpassword/:jeton",
		name: "Password",
		component: Password,
		meta: {
			title: "Ferme La Civraie / Initialisation mot de passe",
		},
	},
	{
		path: "/produits_vente_magasin",
		name: "ProdShop",
		component: ProdShop,
		meta: {
			title: "Ferme La Civraie / Produits magasin",
		},
	},
	{
		path: "/produits_vente_commande",
		name: "ProdOrder",
		component: ProdOrder,
		meta: {
			title: "Ferme La Civraie / Produits commande",
		},
	},
	{
		path: "/tous_produits",
		name: "Products",
		component: Products,
		meta: {
			title: "Ferme La Civraie / Tous Produits",
		},
		//TODO Limiter l'accès au proprio
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
