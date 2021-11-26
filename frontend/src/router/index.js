import { createRouter, createWebHistory } from "vue-router";
import Signup from "../views/Signup.vue";
import Password from "../views/Password.vue";
// import ProdShop from "../views/ProdShop.vue";
import ProdOrder from "../views/ProdOrder.vue";
import Products from "../views/Products.vue";
import Producers from "../views/Producers.vue";
import Users from "../views/Users.vue";
import Orders from "../views/Orders.vue";
import Panier from "../views/Panier.vue";
import SendEmail from "../views/SendEmail.vue";
import OpeningHours from "../views/OpeningHours.vue";
import ProducersCarousel from "../views/ProducersCarousel.vue";
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
	// {
	// 	path: "/produits_vente_magasin",
	// 	name: "ProdShop",
	// 	component: ProdShop,
	// 	meta: {
	// 		title: "Ferme La Civraie / Produits magasin",
	// 	},
	// },
	{
		path: "/panier",
		name: "Panier",
		component: Panier,
		meta: {
			title: "Ferme La Civraie / Mon Panier",
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
		path: "/producteurs_carousel",
		name: "Producteurs",
		component: ProducersCarousel,
		meta: {
			title: "Ferme La Civraie / Producteurs",
		},
	},
	{
		path: "/envoi_email",
		name: "SendEmail",
		component: SendEmail,
		meta: {
			title: "Ferme La Civraie / Envoi email",
		},
		//TODO Limiter l'accès au proprio
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
		path: "/producteurs",
		name: "Producers",
		component: Producers,
		meta: {
			title: "Ferme La Civraie / Liste Producteurs",
		},
		//TODO Limiter l'accès au proprio
	},
	{
		path: "/utilisateurs",
		name: "Users",
		component: Users,
		meta: {
			title: "Ferme La Civraie / Utilisateurs",
		},
		//TODO Limiter l'accès au proprio
	},
	{
		path: "/commandes",
		name: "Orders",
		component: Orders,
		meta: {
			title: "Ferme La Civraie / Commandes",
		},
		//TODO Limiter l'accès au proprio
	},
	{
		path: "/horaires_ouverture",
		name: "OpeningHours",
		component: OpeningHours,
		meta: {
			title: "Ferme La Civraie / Horaires ouverture",
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
