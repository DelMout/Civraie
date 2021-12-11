<template>
	<div id="signup">
		<div>
			<img
				@click="returnHome"
				id="logoAccueil"
				src="../assets/fermeCivraie.png"
				alt="logo Civraie"
			/>
		</div>
		<p class="produ">19 producteurs et artisans réunis près de chez vous !</p>
		<p id="openhours"></p>

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
						@keyup.enter="enter"
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
		<div v-if="!(creation || forgot || logged) && !connectionInProgress">
			<Button
				label="Se connecter"
				class="p-button-raised p-button-primary login"
				@click="login"
			/>
		</div>
		<div v-if="connectionInProgress">
			<ProgressSpinner />
		</div>
		<p>{{ info }}</p>

		<div v-if="forgot && !forgotSent">
			<Button
				label="Demander un nouveau mot de passe"
				class="p-button-raised p-button-primary login"
				@click="forgotten"
			/>
		</div>
		<div v-if="forgotSent">
			<ProgressSpinner />
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
			<div v-if="!(creation || forgot || logged)">
				<a href="https://www.facebook.com/Fermedelacivraie/" target="_blank"
					><span class="pi pi-facebook facebook"></span
				></a>
			</div>
		</div>
		<div id="copyright">
			<a href="https://www.delmout.com" target="_blank"
				><p><i>&#xA9; Site créé par Delphine Moutault</i></p></a
			>
		</div>
		<div style="width:30vw">
			<Toast position="center" :breakpoints="{ '400px': { width: '95%' } }">
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
			info: "",
			creation: false,
			forgot: false,
			logged: false,
			passwordInd: false,
			forgotSent: false,
			openhours: "",
			connectionInProgress: false,
			errors: [
				{
					error: "Validation is on phone failed",
					message: "Le numéro de téléphone n'est pas correctement saisi.",
				},
				{
					error: "password not enough strong",
					message: "Votre mot de passe n'est pas assez fort.",
				},
				{
					error: "Validation isEmail on email failed",
					message: "Votre adresse email n'est pas correcte.",
				},
				{
					error: "Validation is on nom failed",
					message: "Votre nom contient des caractères indésirables.",
				},
				{
					error: "Validation is on prenom failed",
					message: "Votre prénom contient des caractères indésirables.",
				},
				{
					error: "Validation notEmpty on prenom failed",
					message: "Merci de renseigner votre prénom.",
				},
				{
					error: "Validation notEmpty on nom failed",
					message: "Merci de renseigner votre nom.",
				},
				{
					error: "Validation notEmpty on phone failed",
					message: "Merci de renseigner votre numéro de téléphone.",
				},
				{
					error: "users.email must be unique",
					message: "Cette adresse email est déjà affectée à un compte.",
				},
			],
		};
	},
	beforeMount: function() {
		this.creation = false;
		this.forgot = false;
		this.logged = false;
		if (!this.connected) {
			localStorage.clear();
		}
		//Update Active=0 for products with cloture_day in the past
		axios.put(process.env.VUE_APP_API + "product/checkactive/putinactive");
	},
	created: function() {
		this.$store.state.inPages = false;
		axios.get(process.env.VUE_APP_API + "information/openhours").then((rep) => {
			let open = document.getElementById("openhours");
			open.innerHTML = rep.data;
		});
	},
	updated: function() {
		//* Openhours
	},

	computed: {
		...mapState(["infoHome", "token", "userId", "isAdmin", "connected", "inPages", "newUser"]),
	},
	methods: {
		...mapMutations(["setUserId", "setToken", "setAdmin", "setNewUser"]),
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
				.then(() => {
					this.$store.commit("setNewUser");
					this.login();
				})
				.catch((err) => {
					for (let i = 0; i < 9; i++) {
						if (this.errors[i].error === err.response.data) {
							this.$toast.add({
								severity: "error",
								detail: this.errors[i].message,
								closable: false,
								life: 4000,
							});
						}
					}
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
					this.connectionInProgress = true;
					const { userId, token, isAdmin } = user.data;
					localStorage.setItem("userId", userId);
					localStorage.setItem("token", token);
					localStorage.setItem("isAdmin", isAdmin);
					this.setAdmin(isAdmin);
					this.$store.dispatch("checkConnect");
					console.log("connected !");
					// Update last-connect and jeton
					axios({
						method: "put",
						url: process.env.VUE_APP_API + "user/login/" + this.email,
						headers: {
							Authorization: `Bearer ${this.token}`,
						},
					})
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

		//* Press Enter on email cell
		enter: function() {
			if (this.creation) {
				this.signup();
			} else {
				this.login();
			}
		},

		//* Password forgotten
		forgotten: function() {
			this.forgotSent = true;
			this.info = "";
			axios
				.post(process.env.VUE_APP_API + "user/emailpassword/" + this.email)
				.then(() => {
					this.$toast.add({
						severity: "info",
						detail: "Email envoyé !",
						closable: false,
						life: 4000,
					});
					this.logged = false;
					this.creation = false;
					this.forgot = false;
					this.forgotSent = false;
				})
				.catch(() => {
					this.forgotSent = false;
					this.$toast.add({
						severity: "error",
						detail: "Cette adresse email ne correspond à aucun compte.",
						closable: false,
						life: 4000,
					});
				});
		},

		//* Want create a new user
		wantCreate: function() {
			this.creation = true;
			this.forgot = false;
			this.logged = false;
			this.passwordInd = true;
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
	margin-bottom: 1rem;
}
#openhours {
	margin-bottom: 2rem;
	font-style: italic;
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
	margin-bottom: 2rem;
}
.creaforget {
	margin-right: 1rem;
	margin-left: 1rem;
}
.facebook {
	font-size: 1.8rem;
	margin-left: 2rem;
	margin-top: 0.5rem;
}
a {
	text-decoration: none;
}
#copyright {
	text-align: left;
	margin-left: 1rem;
	position: fixed;
	bottom: 0px;
}
#copyright a {
	color: #4caf50;
}

/* MEDIA QUERIES */

@media only screen and (max-width: 768px) {
	/*mobiles et tablettes*/
	.cells {
		width: 30%;
	}
}
@media only screen and (max-width: 576px) {
	/*mobiles */
	#logoAccueil {
		width: 50%;
	}
	.produ {
		width: 90%;
		margin: auto;
	}
	.cells {
		width: 50%;
	}
	.creaforget {
		padding: 0.2rem 0.2rem 0.2rem 0.2rem;
		margin-left: 0.3rem;
		margin-right: 0.3rem;
	}
	.facebook {
		margin-left: 0.3rem;
	}
}
</style>
