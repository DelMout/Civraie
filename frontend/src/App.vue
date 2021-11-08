<template>
	<div id="connected" v-if="logged">
		<div class="panier_connect">
			<p><a href="http://localhost:8080/panier">Mon Panier</a></p>
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
		<router-link class="link" v-if="isAdmin === 1" to="/tous_produits"
			>* Produits *</router-link
		>
		<router-link class="link" v-if="isAdmin === 1" to="/producteurs"
			>* Producteurs *</router-link
		>
		<router-link class="link" v-if="isAdmin === 1" to="/utilisateurs"
			>* Utilisateurs *</router-link
		>
		<router-link class="link" v-if="isAdmin === 1" to="/commandes">* Commandes *</router-link>
		<!-- <router-link class="link" to="/panier">Mon Panier</router-link> -->
	</div>
	<router-view />
</template>
<script>
import { mapState, mapActions } from "vuex"; // for authentification
export default {
	data() {
		return {};
	},
	computed: {
		...mapState(["logged"]),
	},
	methods: {
		...mapActions(["disconnect"]),

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

a.router-link-exact-active {
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
