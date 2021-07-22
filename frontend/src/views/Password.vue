<template>
	<div>
		<h1>Bonjour {{ prenom }} {{ nom }}</h1>
		<p>Merci de renseigner ci-dessous votre nouveau mot de passe.</p>
		<p class="Coord">
			<label for="password">Mot de passe</label
			><input class="" type="text" id="password" v-model="password" />
		</p>
		<button class="" type="button" @click="setpassword">Valider</button>
	</div>
</template>
<script>
import axios from "axios";

export default {
	data() {
		return {
			prenom: "",
			nom: "",
			password: "",
			email: "",
		};
	},
	beforeMount: function() {
		this.findDatas();
	},
	methods: {
		//* Find datas user from jeton
		findDatas: function() {
			axios({
				method: "get",
				url: process.env.VUE_APP_API + "user/" + this.$route.params.jeton,
			}).then((user) => {
				this.prenom = user.data.prenom;
				this.nom = user.data.nom;
				this.email = user.data.email;
			});
		},

		//* Save new password
		setpassword: function() {
			axios
				.put(process.env.VUE_APP_API + "user/password/" + this.$route.params.jeton, {
					password: this.password,
				})
				.then(() => {
					this.$router.push("/");
					// login
					axios
						.post(process.env.VUE_APP_API + "user/login", {
							email: this.email,
							password: this.password,
						})
						.then(() => {
							// MAJ last_connect + jeton
							axios
								.put(process.env.VUE_APP_API + "user/login/" + this.email)
								.then(() => {
									//TODO Donner info que user connecté !
									console.log("Donner info que user connecté ! : LocalStorage");
								});
						})
						.catch(() => {
							console.log("Y a un kouak !");
						});
				})
				.catch((err) => {
					console.log(err);
				});
		},
	},
};
</script>
