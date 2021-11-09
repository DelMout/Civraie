<template>
	<div>
		<h4>Horaires d'ouverture du magasin</h4>
		<p>{{ info }}</p>
		<p>Cette mention apparait sur l'accueil du site et en bas des mails envoyés.</p>
		<p>
			<label for="hours">Ouverture du magasin : </label
			><textarea class="" id="hours" row="5" col="63" v-model="hours"></textarea>
		</p>
		<div>
			<button @click="modifOpenHours">Valider les modifications</button>
		</div>
	</div>
</template>
<script>
import axios from "axios";

export default {
	data() {
		return {
			hours: "",
			info: "",
		};
	},
	created: function() {
		//*Pick up opening hours
		axios
			.get(process.env.VUE_APP_API + "information/openhours")
			.then((rep) => {
				this.hours = rep.data;
			})
			.catch((err) => {
				console.log(err);
			});
	},
	methods: {
		//* Save modifications of opening hours
		modifOpenHours: function() {
			axios
				.put(process.env.VUE_APP_API + "information/openhours/modification", {
					content: this.hours,
				})
				.then(() => {
					this.info = "Les horaires d'ouverture ont été modifiés.";
				})
				.catch((err) => {
					this.info = err;
				});
		},
	},
};
</script>
