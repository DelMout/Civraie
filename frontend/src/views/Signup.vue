<template>
	<div id="signup">
		<div>
			<!-- <img src="../assets/butterfly.png" alt="" /> -->
			<img
				@click="returnHome"
				id="logoAccueil"
				src="../assets/fermeCivraie.png"
				alt="logo ferme Civraie"
			/>
		</div>
		<p class="produ">
			Réservez vos commandes de produits locaux de qualité et BIO <br />parmi 19 producteurs
			et artisans locaux.<br />
			Livraison au magasin de la Ferme de la Civraie <br />à Noyant tous les vendredis.
		</p>
		<p>
			<i
				>Ferme de la Civraie<br />
				La Civraie - Noyant<br />
				49490 Noyant-Villages
			</i>
		</p>
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
			<div id="rgpd">
				<p>
					<Checkbox v-model="checked" :binary="true" /> En soumettant ce formulaire,
					j'accepte que les informations saisies soient uniquement utilisées pour
					permettre de me contacter et de traiter mes commandes. <br />Plus d'informations
					dans
					<span>
						<a href="/mentions_legales" target="_blank"
							><i>Mentions Légales</i></a
						></span
					>.
				</p>
			</div>
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
		<p id="info">{{ info }}</p>

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
			<div id="mentions">
				<a href="/mentions_legales" target="_blank"
					><p><i>Mentions Légales</i></p></a
				>
			</div>
			<div>
				<a href="https://www.delmout.com" target="_blank"
					><p><i>&#xA9; Site créé par Delphine Moutault</i></p></a
				>
			</div>
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
import moment from "moment";
import { mapMutations, mapState, mapActions } from "vuex";

export default {
	data() {
		return {
			prenom: "",
			nom: "",
			email: "",
			phone: "",
			password: "",
			info: "",
			creation: false,
			forgot: false,
			logged: false,
			passwordInd: false,
			forgotSent: false,
			connectionInProgress: false,
			checked: false,
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
	mounted: function() {
		this.$store.commit("setTotal", localStorage.getItem("Total")); // Pour mise à jour du panier
		if (!this.$store.state.connected && this.$store.state.expired) {
			this.$toast.add({
				severity: "warn",
				detail: "Votre session a expiré.",
				closable: false,
				life: 4000,
			});
		}
		if (this.$store.state.deleted) {
			this.$toast.add({
				severity: "success",
				detail: "Votre compte utilisateur a été supprimé !",
				closable: false,
				life: 4000,
			});
			this.$store.commit("setDeleted", false);
		}
	},
	created: function() {
		this.$store.state.inPages = false;
		axios.get(process.env.VUE_APP_API + "information/openhours").then((rep) => {
			let open = document.getElementById("openhours");
			open.innerHTML = rep.data;
		});
	},

	computed: {
		...mapState([
			"infoHome",
			"token",
			"userId",
			"isAdmin",
			"connected",
			"inPages",
			"newUser",
			"expired",
			"deleted",
		]),
	},
	methods: {
		...mapMutations([
			"setUserId",
			"setToken",
			"setAdmin",
			"setNewUser",
			"setTotal",
			"setDeleted",
		]),
		...mapActions(["checkConnect"]),
		//* Create a user
		signup: function() {
			if (!this.checked) {
				this.$toast.add({
					severity: "error",
					detail:
						"Pour valider votre inscription vous devez cocher la case sur le consentement du traitement des données.",
					closable: false,
					life: 4000,
				});
			} else {
				axios
					.post(process.env.VUE_APP_API + "user/signup", {
						prenom: this.prenom,
						nom: this.nom,
						phone: this.phone,
						email: this.email,
						password: this.password,
						consent_RGPD: 1,
						consent_date: moment().format("YYYY-MM-DD"),
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
			}
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
					this.$store.commit("setExpired", false);
					this.$store.dispatch("checkConnect");
					// Update last-connect and jeton
					axios({
						method: "put",
						url: process.env.VUE_APP_API + "user/login/" + this.email,
						headers: {
							Authorization: `Bearer ${this.token}`,
						},
					})
						.then(() => {
							if (this.isAdmin === 1) {
								this.$router.push("/commandes");
							} else {
								this.$router.push("/produits_vente_commande");
							}
						})
						.catch(() => {
							if (this.isAdmin === 1) {
								this.$router.push("/commandes");
							} else {
								this.$router.push("/produits_vente_commande");
							}
						});
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
				"Merci de renseigner votre adresse email. Vous allez recevoir un email pour initialiser votre mot de passe.";
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
@font-face {
	font-family: "dancing";
	src: url("../assets/dancingscript-regular-webfont.ttf") format("truetype");
}
@font-face {
	font-family: "caveat";
	src: url("../assets/caveat-regular.ttf") format("truetype");
}
#logoAccueil {
	display: flex;
	width: 30%;
	margin: auto;
	cursor: pointer;
}
.produ {
	font-size: 1.8rem;
	margin-bottom: 1rem;
	font-family: "caveat";
}
#openhours {
	margin-bottom: 2rem;
	font-style: italic;
}
#signup {
	font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
	color: white;
	cursor: url("../assets/but.png"), auto;
}
label {
	text-align: left;
}
.cells,
#rgpd {
	width: 15%;
	margin: auto;
	cursor: none;
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
span a {
	text-decoration: underline;
	color: #4caf50;
}
#rgpd {
	text-align: justify;
}
#copyright {
	width: 98%;
	text-align: left;
	margin-left: 1%;
	position: fixed;
	bottom: 0px;
	display: flex;
	justify-content: space-between;
}
#copyright a {
	color: #4caf50;
}
#info {
	width: 60%;
	margin: auto;
	margin-bottom: 2rem;
}

/* MEDIA QUERIES */
@media only screen and (max-width: 1500px) {
	#rgpd {
		width: 40%;
	}
}

@media only screen and (max-width: 768px) {
	/*mobiles et tablettes*/
	.cells {
		width: 30%;
	}
	#rgpd {
		width: 60%;
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
	#copyright {
		text-align: center;
		flex-direction: column;
		background-color: #122f1c;
	}
	#createForget {
		display: flex;
		justify-content: center;
		margin-bottom: 10rem;
	}
	#mentions {
		padding-bottom: 0rem;
		height: 2rem;
	}
}
</style>
