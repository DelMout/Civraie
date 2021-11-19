<template>
	<div id="signup">
		<!-- <h1>Bienvenue à la ferme de La Civraie</h1>
		<p>Des produits frais et de saison toute l'année</p> -->
		<div>
			<img id="logoAccueil" src="../assets/fermeCivraie.png" alt="logo Civraie" />
		</div>
		<p class="produ">19 producteurs et artisans réunis près de chez vous !</p>

		<!-- <p v-if="creation" class="Coord">
			<label for="firstname">Prénom</label
			><input class="" type="text" id="firstname" v-model="prenom" />
		</p> -->
		<div class="cells">
			<div class="">
				<p class="p-float-label " v-if="creation">
					<InputText class="fill" id="firstname" type="text" v-model="prenom" /><label
						for="firstname"
						>Prénom</label
					>
				</p>
				<p class="p-float-label " v-if="creation">
					<InputText class="fill" id="lastname" type="text" v-model="nom" />
					<label for="lastname">Nom</label>
				</p>
				<p class="p-float-label " v-if="!logged">
					<InputText class="fill" id="email" type="text" v-model="email" />
					<label for="email">Email</label>
				</p>
				<p class="p-float-label " v-if="creation">
					<InputText class="fill" id="phone" type="text" v-model="phone" />
					<label for="phone">Téléphone</label>
				</p>
				<p class="p-float-label " v-if="!(forgot || logged)">
					<InputText class="fill" id="password" type="text" v-model="password" />
					<label for="password">Mot de passe</label>
				</p>
			</div>
		</div>
		<div v-if="!(!creation || forgot)">
			<button class="" type="button" @click="signup">Valider mon inscription</button>
		</div>
		<div v-if="!(creation || forgot || logged)">
			<button class="" type="button" @click="login">Se connecter</button>
		</div>
		<div v-if="forgot">
			<button class="" type="button" @click="forgotten">
				Demander un nouveau mot de passe
			</button>
		</div>
		<p>{{ infoPrem }}</p>
		<p>{{ info }}</p>
		<div v-if="!(creation || forgot || logged)">
			<button class="" type="button" @click="wantCreate">Créer un compte</button>
		</div>
		<div v-if="!(creation || forgot || logged)">
			<button class="" type="button" @click="wantNewPassword">Mot de passe oublié</button>
		</div>
	</div>
</template>
<script>
import axios from "axios";
import { mapMutations, mapState, mapActions } from "vuex";

export default {
	data() {
		return {
			prenom: "",
			nom: "",
			email: "",
			phone: "",
			password: "",
			admin: "",
			infoPrem: "",
			info: "",
			creation: false,
			forgot: false,
			logged: false,
		};
	},
	beforeMount: function() {
		this.creation = false;
		this.forgot = false;
		this.logged = false;
		localStorage.clear(); //! A modifier qd user en fonction !
		//Update Active=0 for products with cloture_day in the past
		axios.put(process.env.VUE_APP_API + "product/checkactive/putinactive");

		//TODO Aller chercler les horaires d'ouverture pour les afficher dans cette page.
	},
	computed: {
		...mapState(["infoHome", "token", "userId", "isAdmin", "logged"]),
	},
	methods: {
		...mapMutations(["setUserId", "setToken", "setAdmin", "setEmail"]),
		...mapActions(["checkConnect"]),
		//* Create a user
		signup: function() {
			axios
				.post(process.env.VUE_APP_API + "user/signup", {
					prenom: this.prenom,
					nom: this.nom,
					phone: this.phone,
					email: this.email,
					password: this.password,
				})
				.then((resp) => {
					this.infoPrem = "Votre compte est créé !";
					this.login();
					console.log(resp);
				})
				.catch((err) => {
					this.info = err;
					// this.info = "Votre compte n'a pas pu être créé :-(";
					//TODO Info si compte déjà existant (adresse email)
					console.log(err);
				});
		},

		//* Login
		login: function() {
			axios
				.post(process.env.VUE_APP_API + "user/login", {
					email: this.email,
					password: this.password,
				})
				.then((user) => {
					const { userId, token, isAdmin } = user.data;
					localStorage.setItem("userId", userId);
					localStorage.setItem("token", token);
					localStorage.setItem("isAdmin", isAdmin);
					this.setAdmin(isAdmin);
					this.$store.dispatch("checkConnect");
					console.log("connected !");
					// Update last-connect and jeton
					axios
						.put(process.env.VUE_APP_API + "user/login/" + this.email)
						.then(() => {
							console.log("last_conn updated");
						})
						.catch((err) => {
							console.log(err);
						});
					if (this.isAdmin === 1) {
						this.$router.push("/commandes");
					} else {
						this.$router.push("/produits_vente_commande");
					}
				})
				.catch((err) => {
					console.log(err);
				});
		},

		//* Password forgotten
		forgotten: function() {
			axios
				.post(process.env.VUE_APP_API + "user/emailpassword/" + this.email)
				.then(() => {
					this.info = "Email envoyé !";
					this.logged = false;
					this.creation = false;
					this.forgot = false;
				})
				.catch(() => {
					this.info = "Cette adresse email ne correspond à aucun compte.";
				});
		},

		//* Want create a new user
		wantCreate: function() {
			this.creation = true;
			this.forgot = false;
			this.logged = false;
			this.info = "Merci de renseigner les informations demandées.";
		},

		//* Want new password
		wantNewPassword: function() {
			this.forgot = true;
			this.creation = false;
			this.logged = false;
			this.info =
				"Merci de renseigner votre adresse email. Vous aller revevoir un email pour initialiser votre mot de passe.";
		},
	},
};
</script>
<style scoped>
#logoAccueil {
	display: flex;
	width: 40%;
	margin: auto;
}
.produ {
	font-size: 1.2rem;
}
#signup {
	font-family: cursive;
	color: white;
}
label {
	text-align: left;
}
.cells {
	color: yellow;
	width: 15%;
	margin: auto;
}
.fill {
	width: 100%;
}
</style>
