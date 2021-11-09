<template>
	<div id="connected" v-if="logged">
		<div class="panier_connect">
			<p>
				<a href="http://localhost:8080/panier">Mon Panier </a><span> {{ total }}</span>
			</p>
		</div>
		<div class="panier_connect">
			<p><i>Vous êtes connecté(e)</i></p>
		</div>
		<div>
			<p><a @click="disconnect">Déconnection</a></p>
		</div>
	</div>
	<div id="nav">
		<router-link class="link" to="/">Accueil </router-link>
		<!-- <router-link class="link" to="/produits_vente_magasin">Produits à la vente </router-link> -->
		<router-link class="link" to="/produits_vente_commande">Commander </router-link>
		<router-link class="link" v-if="isAdminApp === 1" to="/envoi_email">* Email *</router-link>
		<router-link class="link" v-if="isAdminApp === 1" to="/commandes"
			>* Commandes *</router-link
		>
		<router-link class="link" v-if="isAdminApp === 1" to="/tous_produits"
			>* Produits *</router-link
		>

		<router-link class="link" v-if="isAdminApp === 1" to="/utilisateurs"
			>* Utilisateurs *</router-link
		>
		<router-link class="link" v-if="isAdminApp === 1" to="/producteurs"
			>* Producteurs *</router-link
		>
		<router-link class="link" v-if="isAdminApp === 1" to="/horaires_ouverture"
			>* Horaires *</router-link
		>

		<!-- <router-link class="link" to="/panier">Mon Panier</router-link> -->
	</div>
	<router-view />
</template>
<script>
import { mapState, mapActions } from "vuex"; // for authentification
export default {
	data() {
		return {
			isAdminApp: 0,
		};
	},
	computed: {
		...mapState(["logged", "isAdmin", "total"]),
	},
	beforeMount: function() {
		this.$store.dispatch("checkConnect"); //! à recopier sur chaque page
		this.isAdminApp = parseInt(localStorage.getItem("isAdmin"));
	},
	updated: function() {
		this.$store.dispatch("checkConnect"); //! à recopier sur chaque page
		this.isAdminApp = parseInt(localStorage.getItem("isAdmin"));
	},
	methods: {
		...mapActions(["disconnect", "checkConnect"]),

		//* Disconnect
		disconnect: function() {
			localStorage.clear();
			this.$store.dispatch("disconnect");
			this.$router.push("http://localhost:8080/");
		},
	},
};
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

#nav {
	padding: 30px;
	padding-top: 0;
}

#nav a {
	text-decoration: none;
	color: #999;
}
#connected a {
	text-decoration: underline;
	cursor: pointer;
}

#nav a.router-link-exact-active {
	color: rgb(11, 112, 11);
	font-weight: 600;
}

#connected {
	display: flex;
	justify-content: flex-end;
	font-size: 0.8rem;
	margin-bottom: 0;
}

.panier_connect {
	margin-right: 1rem;
}
.link {
	margin-right: 1rem;
	margin-left: 1rem;
}
</style>
