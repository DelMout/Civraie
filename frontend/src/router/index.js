import { createRouter, createWebHistory } from "vue-router";
import Signup from "../views/Signup.vue";
import Password from "../views/Password.vue";
import ProdOrder from "../views/ProdOrder.vue";
import Products from "../views/Products.vue";
import StockManag from "../views/StockManag.vue";
import Categories from "../views/Categories.vue";
import Producers from "../views/Producers.vue";
import Users from "../views/Users.vue";
import Account from "../views/Account.vue";
import Orders from "../views/Orders.vue";
import Snails from "../views/Snails.vue";
import Panier from "../views/Panier.vue";
import SendEmail from "../views/SendEmail.vue";
import OpeningHours from "../views/OpeningHours.vue";
import ProducersCarousel from "../views/ProducersCarousel.vue";
import MentionsLegales from "../views/MentionsLegales.vue";
import NotFound from "../views/NotFound.vue";
import store from "../store/index.js";

const routes = [
	{
		path: "/",
		name: "Signup",
		component: Signup,
		meta: {
			publicRoute: true,
			title: "Magasin Civraie",
			metaTags: [{ name: "description", content: "Commande de produits locaux, BIO." }],
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

	{
		path: "/panier",
		name: "Panier",
		component: Panier,
		meta: {
			title: "Magasin Civraie / Mon Panier",
			requiresAuth: true,
		},
	},

	{
		path: "/produits_vente_commande",
		name: "ProdOrder",
		component: ProdOrder,
		meta: {
			publicRoute: true,
			title: "Magasin Civraie / Produits commande",
			metaTags: [
				{
					name: "description",
					content:
						"Commande de légumes frais, produits laitiers, viandes, œufs, escargots, miels, vins, huiles, pâtes.",
				},
			],
		},
	},
	{
		path: "/producteurs_carousel",
		name: "Producteurs",
		component: ProducersCarousel,

		meta: {
			publicRoute: true,
			title: "Magasin Civraie / Producteurs",
			metaTags: [
				{
					name: "description",
					content:
						"Présentation et détail des articles proposés par les producteurs réunis à la ferme de la Civraie à Noyant (49).",
				},
			],
		},
	},
	{
		path: "/mentions_legales",
		name: "MentionsLegales",
		component: MentionsLegales,
		meta: {
			title: "Magasin Civraie / Mentions Légales",
		},
	},
	{
		path: "/compte_client",
		name: "Account",
		component: Account,
		meta: {
			title: "Magasin Civraie / Compte client",
		},
		beforeEnter: (to, from, next) => {
			store.dispatch("checkConnect");
			if (!store.state.connected) {
				next({ name: "Signup" });
			} else {
				next();
			}
		},
	},
	{
		path: "/envoi_email",
		name: "SendEmail",
		component: SendEmail,
		meta: {
			title: "Magasin Civraie / Envoi email",
		},
		beforeEnter: (to, from, next) => {
			store.dispatch("checkConnect");
			if (!store.state.connected) {
				next({ name: "Signup" });
			} else {
				if (localStorage.getItem("isAdmin") == 0) {
					next({ name: "Signup" });
				} else {
					next();
				}
			}
		},
	},
	{
		path: "/tous_produits",
		name: "Products",
		component: Products,
		meta: {
			title: "Magasin Civraie / Tous Produits",
		},
		beforeEnter: (to, from, next) => {
			store.dispatch("checkConnect");
			if (!store.state.connected) {
				next({ name: "Signup" });
			} else {
				if (localStorage.getItem("isAdmin") == 0) {
					next({ name: "Signup" });
				} else {
					next();
				}
			}
		},
	},
	{
		path: "/suivi_stock",
		name: "StockManag",
		component: StockManag,
		meta: {
			title: "Magasin Civraie / Suivi Stock",
		},
		beforeEnter: (to, from, next) => {
			store.dispatch("checkConnect");
			if (!store.state.connected) {
				next({ name: "Signup" });
			} else {
				if (localStorage.getItem("isAdmin") == 0) {
					next({ name: "Signup" });
				} else {
					next();
				}
			}
		},
	},
	{
		path: "/categories",
		name: "Categories",
		component: Categories,
		meta: {
			title: "Magasin Civraie / Categories",
		},
		beforeEnter: (to, from, next) => {
			store.dispatch("checkConnect");
			if (!store.state.connected) {
				next({ name: "Signup" });
			} else {
				if (localStorage.getItem("isAdmin") == 0) {
					next({ name: "Signup" });
				} else {
					next();
				}
			}
		},
	},
	{
		path: "/producteurs_liste",
		name: "Producers",
		component: Producers,
		meta: {
			title: "Magasin Civraie / Liste Producteurs",
		},
		beforeEnter: (to, from, next) => {
			store.dispatch("checkConnect");
			if (!store.state.connected) {
				next({ name: "Signup" });
			} else {
				if (localStorage.getItem("isAdmin") == 0) {
					next({ name: "Signup" });
				} else {
					next();
				}
			}
		},
	},
	{
		path: "/utilisateurs",
		name: "Users",
		component: Users,
		meta: {
			title: "Magasin Civraie / Utilisateurs",
		},
		beforeEnter: (to, from, next) => {
			store.dispatch("checkConnect");
			if (!store.state.connected) {
				next({ name: "Signup" });
			} else {
				if (localStorage.getItem("isAdmin") == 0) {
					next({ name: "Signup" });
				} else {
					next();
				}
			}
		},
	},
	{
		path: "/commandes",
		name: "Orders",
		component: Orders,
		meta: {
			title: "Magasin Civraie / Commandes",
		},
		beforeEnter: (to, from, next) => {
			store.dispatch("checkConnect");
			if (!store.state.connected) {
				next({ name: "Signup" });
			} else {
				if (localStorage.getItem("isAdmin") == 0) {
					next({ name: "Signup" });
				} else {
					next();
				}
			}
		},
	},
	{
		path: "/escargots",
		name: "Snails",
		component: Snails,
		meta: {
			title: "Magasin Civraie / Escargots",
		},
		beforeEnter: (to, from, next) => {
			store.dispatch("checkConnect");
			if (!store.state.connected) {
				next({ name: "Signup" });
			} else {
				if (localStorage.getItem("isAdmin") == 0) {
					next({ name: "Signup" });
				} else {
					next();
				}
			}
		},
	},
	{
		path: "/horaires_ouverture",
		name: "OpeningHours",
		component: OpeningHours,
		meta: {
			title: "Magasin Civraie / Horaires ouverture",
		},
		beforeEnter: (to, from, next) => {
			store.dispatch("checkConnect");
			if (!store.state.connected) {
				next({ name: "Signup" });
			} else {
				if (localStorage.getItem("isAdmin") == 0) {
					next({ name: "Signup" });
				} else {
					next();
				}
			}
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

router.beforeEach((to, from, next) => {
	store.dispatch("checkConnect");
	if (to.meta.requiresAuth) {
		if (!store.state.connected) {
			next({ name: "Signup" });
		} else {
			next();
		}
	} else {
		next();
	}
});

export default router;
