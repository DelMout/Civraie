<template>
	<div>
		<h4>Horaires d'ouverture du magasin</h4>
		<i>Cette mention apparait sur l'accueil du site et en bas des mails envoyés.</i>
		<div id="window">
			<p>Ouverture du magasin :</p>
			<Editor v-model="hours" editorStyle="height: 20vh;">
				<template #toolbar>
					<span class="ql-formats">
						<button class="ql-bold"></button>
						<button class="ql-italic"></button>
						<button class="ql-underline"></button>
					</span>
				</template>
			</Editor>
		</div>
		<div>
			<div v-if="!modifSent">
				<Button
					label="Valider les modifications"
					class="p-button-raised p-button "
					@click="modifOpenHours"
				/>
			</div>
			<div v-if="modifSent">
				<ProgressSpinner />
			</div>
		</div>
		<div>
			<Dialog header="Confirmation" v-model:visible="dialog" :style="{ width: '15vw' }"
				><p>Modifications sauvegardées !</p>
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
			hours: "",
			hoursFormed: "",
			modifSent: false,
			dialog: false,
		};
	},
	beforeMount: function() {
		this.$store.dispatch("checkConnect");
	},
	created: function() {
		this.$store.state.inPages = true;
		//*Pick up opening hours
		axios
			.get(process.env.VUE_APP_API + "information/openhours")
			.then((rep) => {
				this.hours = rep.data;
			})
			.catch(() => {
				this.hours = "Erreur, affichage des horaires d'ouverture !";
			});
	},
	computed: {
		...mapState(["token", "connected"]),
	},
	methods: {
		...mapActions(["checkConnect"]),
		//* Save modifications of opening hours
		modifOpenHours: function() {
			this.$store.dispatch("checkConnect");
			if (!this.connected) {
				this.$router.push("/");
			} else {
				this.modifSent = true;
				this.hoursFormed = this.hours.replace(/<p>/g, "<p style='margin:0'>");
				axios({
					method: "put",
					url: process.env.VUE_APP_API + "information/openhours/modification",
					data: {
						content: this.hoursFormed,
					},
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				}).then(() => {
					this.dialog = true;
					this.modifSent = false;
				});
			}
		},

		//* Close Dialog
		close: function() {
			this.dialog = false;
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
