<template>
	<div>
		<h3>Bonjour {{ prenom }} {{ nom }},</h3>
		<p>Merci de renseigner ci-dessous votre nouveau mot de passe.</p>
		<div id="juxtaButton">
			<p class="p-float-label field">
				<Password
					class="fill "
					id="password"
					@keyup.enter="enter"
					v-model="password"
					inputStyle="width:100%"
					:feedback="true"
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
			<Button label="Valider" class="p-button-raised p-button valider" @click="setpassword" />
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
			password: "",
			email: "",
		};
	},
	beforeMount: function() {
		this.findDatas();
	},
	computed: {
		...mapState(["", "token", "userId", "isAdmin"]),
	},
	methods: {
		...mapMutations(["setAdmin"]),
		...mapActions(["checkConnect"]),
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
					// login
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
							// MAJ last_connect + jeton
							axios
								.put(process.env.VUE_APP_API + "user/login/" + this.email)
								.then(() => {
									this.$router.push("/produits_vente_commande");
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
		//* Press Enter on email cell
		enter: function() {
			this.setpassword();
		},
	},
};
</script>
<style scoped>
.field {
	width: 20vw;
	margin-right: 2rem;
}
.fill {
	width: 20vw;
}
#juxtaButton {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 2rem;
}
.valider {
	height: 40px;
}
</style>
