<template>
	<div>
		<!-- Table pour le panier de commande -->
		<div v-if="total === 0">
			<p>
				Votre panier est actuellement vide.
			</p>
		</div>
		<div id="commande" v-if="total > 0">
			<h5>Votre commande pour une livraison le {{ deliveryDate }}.</h5>

			<table>
				<caption>
					Votre commande
				</caption>
				<tr>
					<th>Produit</th>
					<th>Quantité</th>
					<th>Unité</th>
					<th>Prix</th>
					<th>Modification</th>
				</tr>
				<tr v-for="prod in order" :key="prod.id">
					<td>{{ prod.product }}</td>
					<td>{{ prod.quantity }}</td>
					<td>{{ prod.unity }}</td>
					<td>{{ numFr(prod.quantity * prod.price_unity) }}</td>
					<td>- + supp</td>
				</tr>
				<!-- <td>Total = {{ total }}</td> -->
				<td colspan="4">
					Prix total de la commande : <span>{{ numFr(total) }} </span>
				</td>
			</table>

			<button class="addsub" type="button" @click="validOrder">
				Valider la commande
			</button>
		</div>
	</div>
</template>
<script>
import { mapState, mapGetters } from "vuex";

export default {
	data() {
		return {
			total: this.$store.state.total,
			products: this.$store.state.products,
			order: this.$store.state.order, //JSON.parse(localStorage.getItem("order")),
		};
	},
	computed: {
		...mapGetters(["deliveryDate"]),
		...mapState(["products", "order"]),
	},
	created: function() {
		console.log("hey !!");
		console.log(this.order);
	},
	methods: {
		//* Number format
		numFr: function(num) {
			return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
				num
			);
		},
	},
};
</script>
<style scoped>
#commande {
	display: flex;
	flex-direction: column;
}
td,
th {
	border: 1px solid white;
	width: 200px;
	height: 40px;
}
th {
	width: 200px;
	height: 40px;
}
table,
caption {
	border-collapse: collapse;
	background-color: greenyellow;
	margin: auto;
}
button {
	background-color: green;
	color: white;
	font-size: 16px;
	font-weight: bold;
	padding: 1px 6px 1px 6px;
	margin: auto;
}
</style>
