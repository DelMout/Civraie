<template>
	<div>
		<h1>Bienvenue à la ferme de La Civraie</h1>
		<p>Des produits frais et de saison toute l'année</p>

		<p v-if="creation" class="Coord">
			<label for="firstname">Prénom</label
			><input class="" type="text" id="firstname" v-model="prenom" />
		</p>
		<p v-if="creation" class="Coord">
			<label for="lastname">Nom</label
			><input class="" type="text" id="lastname" v-model="nom" />
		</p>
		<p v-if="!logged" class="Coord">
			<label for="email">Adresse email</label
			><input class="" type="text" id="email" v-model="email" />
		</p>
		<p v-if="creation" class="Coord">
			<label for="phone">Téléphone</label
			><input class="" type="text" id="phone" v-model="phone" />
		</p>
		<p v-if="!(forgot || logged)" class="Coord">
			<label for="password">Mot de passe</label
			><input class="" type="text" id="password" v-model="password" />
		</p>
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
	},
	methods: {
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
			const formData = new FormData();
			formData.append("pseudo", this.$data.pseudo);
			formData.append("interet", this.$data.interet);
			formData.append("frequence", this.$data.frequence);
			formData.append("jour", this.$data.jour);
			formData.append("heure", this.$data.heure);
			formData.append("participants", this.$data.participants);
			formData.append("jeux", this.$data.jeux);
			formData.append("nouveau", this.$data.nouveau);
			formData.append("suggestions", this.$data.suggestions);
			formData.append("commentaires", this.$data.commentaires);
			axios
				.post(
					"http://localhost:3001/api/sondage/savesondage",
					formData
					// {
					// pseudo: this.pseudo,
					// interet: this.interet,
					// frequence: this.frequence,
					// jour: this.jour,
					// heure: this.heure,
					// participants: this.participants,
					// jeux: this.jeux,
					// nouveau: this.nouveau,
					// suggestions: this.suggestions,
					// commentaires: this.commentaires,
					// }
				)
				.then(() => {
					console.log("connected !");
					// this.$router.push("/produits_vente_commande");
				})
				.catch((err) => {
					console.log(err);
				});

			// axios
			// 	.post(process.env.VUE_APP_API + "user/login", {
			// 		email: this.email,
			// 		password: this.password,
			// 	})
			// 	.then(() => {
			// 		// Find firstname and name of user
			// 		axios
			// 			.get(process.env.VUE_APP_API + "user/firstname/" + this.email)
			// 			.then((user) => {
			// 				this.prenom = user.data.prenom;
			// 				this.nom = user.data.nom;
			// 				this.admin = user.data.isAdmin;

			// 				// MAJ last_connect + jeton
			// 				axios
			// 					.put(process.env.VUE_APP_API + "user/login/" + this.email)
			// 					.then(() => {
			// 						//TODO Info à transmettre dans Vuex
			// 						// this.info =
			// 						// 	"Bonjour " +
			// 						// 	this.prenom +
			// 						// 	" " +
			// 						// 	this.nom +
			// 						// 	", vous êtes connecté(e).";
			// 						this.logged = true;
			// 						this.creation = false;
			// 						this.forgot = false;
			// 						if (this.admin === 0) {
			// 							this.$router.push("/produits_vente_commande");
			// 						}
			// 						if (this.admin === 1) {
			// 							this.$router.push("/tous_produits");
			// 						}
			// 					})

			// 					.catch(() => {
			// 						this.info = "Adresse email ou mot de passe erroné.";
			// 					});
			// 			});
			// 	});
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
