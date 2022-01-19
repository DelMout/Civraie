<template>
	<div>
		<h4>Envoi email à tous les utilisateurs</h4>
		<div>
			<p id="titre">
				<label for="object">Objet : </label
				><InputText type="text" id="object" v-model="object" />
			</p>
			<div id="window">
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
			<div id="pied">
				<p>
					Passez votre commande sur le site de la ferme de La Civraie :
					<br />
					<a href="https://fermedelacivraie.delmout.com/">La ferme de la Civraie</a>
				</p>

				<p>
					La ferme de La Civraie<br />
					Magasin Civraie, Si Frais<br />
					<i id="openhours"></i>
					Adrien et Céline Pichon<br />
					<a href="#">adrienpichon<span class="pi pi-at"></span>live.fr</a><br />
					La Civraie<br />
					Noyant<br />
					49490 Noyant-Villages<br />
					Tél : 06 14 10 04 47
				</p>
				<img src="../assets/fermeCivraie.png" alt="logo Civraie" />
			</div>
			<div v-if="!emailSent">
				<Button
					label="Envoyer l'email"
					class="p-button-raised p-button-primary envoi"
					@click="sendEmail"
				/>
			</div>
			<div v-if="emailSent">
				<ProgressSpinner />
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
		<div>
			<Dialog header="Confirmation" v-model:visible="dialog" :style="{ width: '15vw' }"
				><p>Email envoyé à tous les utilisateurs.</p>
				<template #footer>
					<Button label="OK" @click="close" autofocus />
				</template>
			</Dialog>
		</div>
	</div>
</template>
<script>
import axios from "axios";
import { mapState, mapActions } from "vuex";

export default {
	data() {
		return {
			object: "",
			body: "",
			emailSent: false,
			dialog: false,
		};
	},
	beforeMount: function() {
		this.$store.dispatch("checkConnect");
	},
	created: function() {
		//*Pick up opening hours
		axios.get(process.env.VUE_APP_API + "information/openhours").then((rep) => {
			let open = document.getElementById("openhours");
			open.innerHTML = rep.data;
		});
		this.$store.state.inPages = true;
	},
	computed: {
		...mapState(["token", "connected"]),
	},
	methods: {
		...mapActions(["checkConnect"]),
		//* Send Email
		sendEmail: function() {
			this.$store.dispatch("checkConnect");
			if (!this.connected) {
				this.$router.push("/");
			} else {
				if (this.object === "") {
					this.$toast.add({
						severity: "error",
						detail: "Merci d'écrire un objet à votre mail.",
						closable: false,
						life: 4000,
					});
				} else {
					if (this.body === "") {
						this.$toast.add({
							severity: "error",
							detail: "Attention, le contenu de votre mail est vide.",
							closable: false,
							life: 4000,
						});
					} else {
						this.emailSent = true;
						axios({
							method: "post",
							url: process.env.VUE_APP_API + "user/emailinfo",
							data: {
								title: this.object,
								content: this.body,
							},
							headers: {
								Authorization: `Bearer ${this.token}`,
							},
						})
							.then(() => {
								this.emailSent = false;
								this.dialog = true;
							})
							.catch(() => {
								this.emailSent = false;
								this.$toast.add({
									severity: "error",
									detail: "Problème technique ! L'email ne peut être envoyé.",
									closable: false,
									life: 4000,
								});
							});
					}
				}
			}
		},

		//* Close Dialog
		close: function() {
			this.dialog = false;
			location.reload();
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
	margin-top: 1rem;
}
h4 {
	margin-top: 0rem;
	margin-bottom: 2rem;
}
#object {
	width: 15vw;
}
#titre {
	width: 40vw;
	margin: auto;
	text-align: left;
	margin-bottom: 0;
}
#pied {
	width: 40vw;
	margin: auto;
	text-align: left;
}
img {
	width: 20vw;
}
.envoi {
	margin-bottom: 2rem;
}
</style>
