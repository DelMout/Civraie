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
			title: "Magasin Civraie",
		},
	},
	{
		path: "/setpassword/:jeton",
		name: "Password",
		component: Password,
		meta: {
			title: "Magasin Civraie / Initialisation mot de passe",
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
			title: "Magasin Civraie / Mon Panier",
		},
	},

	{
		path: "/produits_vente_commande",
		name: "ProdOrder",
		component: ProdOrder,
		meta: {
			title: "Magasin Civraie / Produits commande",
		},
	},
	{
		path: "/producteurs_carousel",
		name: "Producteurs",
		component: ProducersCarousel,
		meta: {
			title: "Magasin Civraie / Producteurs",
		},
	},
	{
		path: "/envoi_email",
		name: "SendEmail",
		component: SendEmail,
		meta: {
			title: "Magasin Civraie / Envoi email",
		},
		//TODO Limiter l'accès au proprio
	},
	{
		path: "/tous_produits",
		name: "Products",
		component: Products,
		meta: {
			title: "Magasin Civraie / Tous Produits",
		},
		//TODO Limiter l'accès au proprio
	},
	{
		path: "/producteurs_liste",
		name: "Producers",
		component: Producers,
		meta: {
			title: "Magasin Civraie / Liste Producteurs",
		},
		//TODO Limiter l'accès au proprio
	},
	{
		path: "/utilisateurs",
		name: "Users",
		component: Users,
		meta: {
			title: "Magasin Civraie / Utilisateurs",
		},
		//TODO Limiter l'accès au proprio
	},
	{
		path: "/commandes",
		name: "Orders",
		component: Orders,
		meta: {
			title: "Magasin Civraie / Commandes",
		},
		//TODO Limiter l'accès au proprio
	},
	{
		path: "/horaires_ouverture",
		name: "OpeningHours",
		component: OpeningHours,
		meta: {
			title: "Magasin Civraie / Horaires ouverture",
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
