<template>
	<div>
		<button @click="select">Sélectionner la date de livraison</button>
		<p v-if="selected">Date de livraison sélectionnée : {{ selectedDate }}</p>
		<div v-for="item in items" :key="item.id">
			<p class="dates" @click="dateSelected($event, item)" v-if="displayList">
				{{ dateFr(item.delivery_date) }}
			</p>
			<!-- <a v-if="displayList" :href="item.id">{{ item.delivery_date }}</a> -->
		</div>
		<p v-if="selected">Date au plus tard pour la saisie des commandes : {{ latestDate }}</p>
	</div>
</template>
<script>
import moment from "moment";
export default {
	name: "Dropdown",
	data() {
		return {
			displayList: false,
			infoButton: "",
		};
	},
	props: ["items"],
	created: function() {
		this.selected = false;
	},
	methods: {
		select: function() {
			this.displayList = true;
		},
		dateFr: function(date) {
			moment.locale("fr");
			return moment(date).format("DD/MM/YYYY");
		},
		dateSelected: function(event, item) {
			this.displayList = false;
			this.selectedDate = this.dateFr(item.delivery_date);
			this.latestDate = this.dateFr(item.latest_date);
			this.selected = true;
		},
	},
};
</script>
<style scoped>
.dates {
	cursor: pointer;
}
</style>
