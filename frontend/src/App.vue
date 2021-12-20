<template>
	<div id="entete">
		<div id="logo">
			<img
				v-if="inPages"
				id="logoEntete"
				src="./assets/fermeCivraie.png"
				alt="logo entete Civraie"
				@click="returnHome"
			/>
			<p></p>
		</div>
		<div id="connected" v-if="connected">
			<div class="panier_connect ">
				<p v-if="total > 0">
					<a href="http://localhost:8080/panier" class="monpanier ">Mon Panier</a>

					<a
						href="http://localhost:8080/panier"
						class="pi pi-shopping-bag p-mr-4 "
						style="font-size:1.5rem;"
						v-badge="total"
					></a>
				</p>
				<p v-if="total == 0">
					<a href="http://localhost:8080/panier" class="monpanier ">Mon Panier</a
					><a
						href="http://localhost:8080/panier"
						class="pi pi-shopping-bag p-mr-4 "
						style="font-size:1.5rem;"
					></a>
				</p>
			</div>
			<!-- <div class="panier_connect" style="margin-top:0.7rem;">
				<p><i>Vous êtes connecté(e)</i></p>
			</div> -->
			<div style="margin-top:0.7rem;">
				<p><a @click="disconnect">Déconnexion</a></p>
			</div>
		</div>
	</div>
	<div id="nav">
		<!-- <router-link class="link" to="/">Accueil </router-link> -->
		<!-- <router-link class="link" to="/produits_vente_magasin">Produits à la vente </router-link> -->
		<div id="custom">
			<router-link class="link " to="/produits_vente_commande">Produits </router-link>
			<router-link class="link" to="/producteurs_carousel">Producteurs </router-link>
		</div>
		<div id="owner">
			<router-link class="link" v-if="isAdminApp === 1" to="/envoi_email"
				>* Email *</router-link
			>
			<router-link class="link jo " v-if="isAdminApp === 1" to="/commandes"
				>* Commandes *</router-link
			>
			<router-link class="link jo " v-if="isAdminApp === 1" to="/escargots"
				>* Escargots *</router-link
			>
			<router-link class="link" v-if="isAdminApp === 1" to="/tous_produits"
				>* Produits *</router-link
			>

			<router-link class="link" v-if="isAdminApp === 1" to="/utilisateurs"
				>* Utilisateurs *</router-link
			>
			<router-link class="link" v-if="isAdminApp === 1" to="/producteurs_liste"
				>* Producteurs *</router-link
			>
			<router-link class="link" v-if="isAdminApp === 1" to="/horaires_ouverture"
				>* Horaires *</router-link
			>
		</div>
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
		...mapState(["connected", "isAdmin", "total", "inPages"]),
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
	display: flex;
	padding: 30px;
	padding-top: 0;
	justify-content: center;
	margin-top: 5rem;
}
a {
	color: white;
}
#owner a {
	color: rgb(158, 158, 20);
}
#custom a {
	color: #999;
}
#custom a.router-link-exact-active {
	color: white;
	font-weight: 600;
	text-decoration: none;
}
#connected a {
	text-decoration: underline;
	cursor: pointer;
}

#owner a.router-link-exact-active {
	color: yellow;
	font-weight: 600;
	text-decoration: none;
}
#entete {
	display: flex;
	justify-content: space-between;
	position: fixed;
	top: 0rem;
	background-color: #122f1c;
	z-index: 20;
	padding-top: 0.5rem;
	padding-bottom: 0;
	width: 100%;
}
#logo {
	margin-left: 2rem;
	display: flex;
	width: 10%;
}

#connected {
	display: flex;
	justify-content: flex-end;
	font-size: 0.8rem;
	margin-bottom: 0;
	margin-right: 2rem;
	position: fixed;
	right: 0;
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
.monpanier {
	margin-right: 0.5rem;
	font-size: 1rem;
}
@media only screen and (max-width: 1280px) {
	#logo {
		width: 12%;
	}
}
@media only screen and (max-width: 1024px) {
	#logo {
		width: 15%;
	}
}
@media only screen and (max-width: 768px) {
	#logo {
		width: 18%;
	}
}

@media only screen and (max-width: 640px) {
	/*mobiles */
	#connected {
		font-size: 0.6rem;
		margin-right: 0.2rem;
	}
	.link {
		font-size: 0.8rem;
	}
	.panier_connect {
		margin-right: 0.2rem;
		/* width: 5rem; */
	}
	.monpanier {
		font-size: 0.6rem;
	}
	#logo {
		width: 20%;
	}
}
</style>
