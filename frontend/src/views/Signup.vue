<template>
	<div id="signup">
		<!-- <h1>Bienvenue à la ferme de La Civraie</h1>
		<p>Des produits frais et de saison toute l'année</p> -->
		<div>
			<img
				@click="returnHome"
				id="logoAccueil"
				src="../assets/fermeCivraie.png"
				alt="logo Civraie"
			/>
		</div>
		<p class="produ">19 producteurs et artisans réunis près de chez vous !</p>

		<div class="cells">
			<div class="">
				<p class="p-float-label field" v-if="creation">
					<InputText class="fill" id="firstname" type="text" v-model="prenom" /><label
						for="firstname"
						>Prénom</label
					>
				</p>
				<p class="p-float-label field" v-if="creation">
					<InputText class="fill" id="lastname" type="text" v-model="nom" />
					<label for="lastname">Nom</label>
				</p>
				<p class="p-float-label field" v-if="!logged">
					<InputText class="fill" id="email" type="text" v-model="email" />
					<label for="email">Email</label>
				</p>
				<p class="p-float-label field" v-if="creation">
					<InputText class="fill" id="phone" type="text" v-model="phone" />
					<label for="phone">Téléphone</label>
				</p>
				<p class="p-float-label field" v-if="!(forgot || logged)">
					<Password
						class="fill "
						id="password"
						v-model="password"
						inputStyle="width:100%"
						:feedback="passwordInd"
						toggleMask
					>
						<template #footer>
							<br />
							<ul class="p-pl-2 p-ml-2 p-mt-0" style="line-height: 1.5">
								<li>Au moins 1 minuscule</li>
								<li>Au moins 1 majuscule</li>
								<li>Au moins 1 chiffre</li>
								<li>Minimum 8 caractères</li>
							</ul>
						</template>
					</Password>
					<label for="password">Mot de passe</label>
				</p>
			</div>
		</div>
		<div v-if="!(!creation || forgot)">
			<Button
				label="Valider mon inscription"
				class="p-button-raised p-button-primary login"
				@click="signup"
			/>
		</div>
		<div v-if="!(creation || forgot || logged)">
			<Button
				label="Se connecter"
				class="p-button-raised p-button-primary login"
				@click="login"
			/>
		</div>
		<p>{{ infoPrem }}</p>
		<p>{{ info }}</p>

		<div v-if="forgot">
			<Button
				label="Demander un nouveau mot de passe"
				class="p-button-raised p-button-primary login"
				@click="forgotten"
			/>
		</div>
		<div id="createForget">
			<div v-if="!(creation || forgot || logged)">
				<Button
					label="Créer un compte"
					class="p-button-raised p-button-text creaforget"
					@click="wantCreate"
				/>
			</div>
			<div v-if="!(creation || forgot || logged)">
				<Button
					label="Mot de passe oublié"
					class="p-button-raised p-button-text creaforget"
					@click="wantNewPassword"
				/>
			</div>
		</div>
		<div style="width:30vw">
			<Toast position="center">
				<template #message="slotProps">
					<div class="p-d-flex p-flex-row">
						<div class="p-text-center">
							<i class="pi pi-exclamation-triangle" style="font-size: 2rem"></i>
							<p>{{ slotProps.message.detail }}</p>
						</div>
					</div>
				</template>
			</Toast>
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
			passwordInd: false,
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
	created: function() {
		this.$store.state.inPages = false;
	},
	computed: {
		...mapState(["infoHome", "token", "userId", "isAdmin", "logged", "inPages"]),
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
					console.log(err.response.data);
					if (err.response.data === "Password not OK") {
						this.$toast.add({
							severity: "error",
							detail: "Mot de passe incorrect !",
							closable: false,
							life: 4000,
						});
					} else {
						this.$toast.add({
							severity: "error",
							detail: "Email inconnu !",
							closable: false,
							life: 4000,
						});
					}
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
			this.passwordInd = true;
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

		//* Refresh page - Go back initial page "Login"
		returnHome: function() {
			location.reload();
			this.passwordInd = false;
		},
	},
};
</script>
<style scoped>
#logoAccueil {
	display: flex;
	width: 30%;
	margin: auto;
	cursor: pointer;
}
.produ {
	font-size: 1.2rem;
	margin-bottom: 2rem;
}
#signup {
	font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
	color: white;
}
label {
	text-align: left;
}
.cells {
	width: 15%;
	margin: auto;
}
.fill {
	width: 100%;
}
.field {
	margin-bottom: 2rem;
}
.login {
	font-weight: bold;
}
#createForget {
	display: flex;
	justify-content: center;
}
.creaforget {
	margin-right: 1rem;
	margin-left: 1rem;
}
</style>
