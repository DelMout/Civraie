<template>
	<div>
		<h4>Envoi email à tous les utilisateurs</h4>
		<p>
			{{ info }}
		</p>

		<div>
			<p>
				<label for="object">Objet : </label
				><input class="" type="text" id="object" v-model="object" />
			</p>
			<div id="window">
				<p>Contenu :</p>
				<Editor v-model="body" editorStyle="height: 50vh;">
					<template #toolbar>
						<span class="ql-formats">
							<button class="ql-bold"></button>
							<button class="ql-italic"></button>
							<button class="ql-underline"></button>
							<button class="ql-list " value="ordered"></button>
							<button class="ql-list " value="bullet"></button>
						</span>
					</template>
				</Editor>
			</div>

			<p>
				Passer votre commande sur le site de la ferme de La Civraie :
				<br />
				<a href="http://localhost:8080/">La ferme de la Civraie</a>
			</p>
			<p>
				Les horaires d'ouverture du magasin :
				<br />
				{{ horaires }}
			</p>
			<p>
				La ferme de La Civraie<br />
				Magasin Civraie, Si Frais<br />
				Adrien et Céline Pichon<br />
				La Civraie<br />
				Noyant<br />
				49490 Noyant-Villages<br />
				Tél : 06 14 10 04 47
			</p>
			<div>
				<button @click="sendEmail">Envoyer l'email</button>
			</div>
		</div>
	</div>
</template>
<script>
import axios from "axios";
import { mapActions } from "vuex";

export default {
	data() {
		return {
			object: "",
			body: "",
			horaires: "",
			info: "",
		};
	},
	beforeMount: function() {
		this.$store.dispatch("checkConnect"); //! à recopier sur chaque page
	},
	created: function() {
		//*Pick up opening hours
		axios
			.get(process.env.VUE_APP_API + "information/openhours")
			.then((rep) => {
				this.horaires = rep.data;
			})
			.catch((err) => {
				console.log(err);
			});
	},
	methods: {
		...mapActions(["checkConnect"]),

		//* Send Email
		sendEmail: function() {
			axios
				.post(process.env.VUE_APP_API + "user/emailinfo", {
					title: this.object,
					content: this.body,
					horaires: this.horaires,
				})
				.then(() => {
					this.info = "Email envoyé à tous les utlisateurs.";
				})
				.catch((err) => {
					this.info = err;
				});
		},
	},
};
</script>
<style scoped>
#window {
	width: 40vw;
	display: flex;
	flex-direction: column;
	margin: auto;
	margin-bottom: 2rem;
	margin-top: 2rem;
}
</style>
