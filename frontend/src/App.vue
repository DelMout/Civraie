<template>
	<div id="entete">
		<div id="logo">
			<img
				v-if="inPages"
				id="logoEntete"
				src="./assets/logocivraie.png"
				alt="logo entete Civraie"
				@click="returnHome"
			/>
			<p></p>
		</div>
		<div id="connected" v-if="logged">
			<div class="panier_connect">
				<p v-if="total > 0">
					<a
						href="http://localhost:8080/panier"
						class="pi pi-shopping-bag p-mr-4"
						style="font-size:1.5rem;"
						v-badge="total"
					></a>
				</p>
				<p v-if="total == 0">
					<a
						href="http://localhost:8080/panier"
						class="pi pi-shopping-bag p-mr-4"
						style="font-size:1.5rem;"
					></a>
				</p>
			</div>
			<div class="panier_connect" style="margin-top:0.7rem;">
				<p><i>Vous êtes connecté(e)</i></p>
			</div>
			<div style="margin-top:0.7rem;">
				<p><a @click="disconnect">Déconnection</a></p>
			</div>
		</div>
	</div>
	<div id="nav">
		<!-- <router-link class="link" to="/">Accueil </router-link> -->
		<!-- <router-link class="link" to="/produits_vente_magasin">Produits à la vente </router-link> -->
		<router-link class="link" to="/produits_vente_commande">Produits </router-link>
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
		...mapState(["logged", "isAdmin", "total", "inPages"]),
	},
	beforeMount: function() {
		this.$store.dispatch("checkConnect"); //! à recopier sur chaque page
		this.isAdminApp = parseInt(localStorage.getItem("isAdmin"));
	},
	updated: function() {
		this.$store.dispatch("checkConnect"); //! à recopier sur chaque page
		this.isAdminApp = parseInt(localStorage.getItem("isAdmin"));
	},
	created: function() {
		this.$store.state.inPages = false;
	},
	methods: {
		...mapActions(["disconnect", "checkConnect"]),

		//* Disconnect
		disconnect: function() {
			localStorage.clear();
			this.$store.dispatch("disconnect");
			this.$router.push("http://localhost:8080/");
		},

		//* Go back to Home
		returnHome: function() {
			this.$store.state.inPages = false;
			this.$router.push("/");
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
	color: white;
	background-color: #122f1c;
	margin-top: 1rem;
}

#nav {
	padding: 30px;
	padding-top: 0;
}
a {
	color: white;
}
#nav a {
	color: #999;
}
#connected a {
	text-decoration: underline;
	cursor: pointer;
}

#nav a.router-link-exact-active {
	color: white;
	font-weight: 600;
	text-decoration: none;
}
#entete {
	display: flex;
	justify-content: space-between;
}
#logo {
	margin-left: 2rem;
	display: flex;
	width: 20%;
}

#connected {
	display: flex;
	justify-content: flex-end;
	font-size: 0.8rem;
	margin-bottom: 0;
	margin-right: 2rem;
}
#logoEntete {
	width: 50%;
	cursor: pointer;
}

.panier_connect {
	margin-right: 1rem;
}
.link {
	margin-right: 1rem;
	margin-left: 1rem;
}
</style>
