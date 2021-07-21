<template>
	<div>
		<h1>Bienvenue à la ferme de La Civraie</h1>
		<p>Ici je m'inscris, je me loggue !</p>

		<p class="Coord">
			<label for="firstname">Prénom</label
			><input class="" type="text" id="firstname" v-model="prenom" />
		</p>
		<p class="Coord">
			<label for="lastname">Nom</label
			><input class="" type="text" id="lastname" v-model="nom" />
		</p>
		<p class="Coord">
			<label for="email">Adresse email</label
			><input class="" type="text" id="email" v-model="email" />
		</p>
		<p class="Coord">
			<label for="phone">Téléphone</label
			><input class="" type="text" id="phone" v-model="phone" />
		</p>
		<p class="Coord">
			<label for="password">Mot de passe</label
			><input class="" type="text" id="password" v-model="password" />
		</p>

		<button class="" type="button" @click="signup">Valider mon inscription</button>

		<button class="" type="button" @click="login">Se connecter</button>
		<button class="" type="button" @click="forgotten">Mot de passe oublié</button>
		<p>{{ info }}</p>
	</div>
</template>
<script>
// import { defineComponent } from "@vue/composition-api";
import axios from "axios";

export default {
	data() {
		return {
			prenom: "",
			nom: "",
			email: "",
			phone: "",
			password: "",
			info: "",
		};
	},
	methods: {
		//* Create a user
		signup: function() {
			axios
				.post("http://localhost:3001/api/user/signup", {
					prenom: this.prenom,
					nom: this.nom,
					phone: this.phone,
					email: this.email,
					password: this.password,
				})
				.then((resp) => {
					this.info = "Votre compte est créé !";
					console.log(resp);
				})
				.catch((err) => {
					this.info = err;
					// this.info = "Votre compte n'a pas pu être créé :-(";
					console.log(err);
				});
		},

		//* Login
		login: function() {
			axios
				.post("http://localhost:3001/api/user/login", {
					email: this.email,
					password: this.password,
				})
				.then(() => {
					this.info = "Compte trouvé !";
					//TODO Rajouter MAJ last_connect
				})
				.catch((err) => {
					this.info = err;
				});
		},

		//* Password forgotten
		forgotten: function() {
			axios
				.post("http://localhost:3001/api/user/emailpassword/" + this.email)
				.then(() => {
					this.info = "Email envoyé !";
				})
				.catch((err) => {
					this.info = err;
				});
		},
	},
};
</script>
