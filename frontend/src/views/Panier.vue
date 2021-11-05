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
					<th>Prix/unité</th>
					<th>Prix</th>
					<th>Modification</th>
				</tr>
				<tr v-for="prod in products" :key="prod.id">
					<td v-if="prod.qty > 0">{{ prod.product }}</td>
					<td v-if="prod.qty > 0">{{ prod.qty }}</td>
					<td v-if="prod.qty > 0">{{ prod.unity }}</td>
					<td v-if="prod.qty > 0">{{ numFr(prod.price_unity) }}</td>
					<td v-if="prod.qty > 0">{{ numFr(prod.qty * prod.price_unity) }}</td>
					<td v-if="prod.qty > 0">- + supp</td>
				</tr>
				<!-- <td>Total = {{ total }}</td> -->
				<tr>
					<td colspan="4">
						Prix total de la commande :
					</td>
					<td id="total">{{ numFr(total) }}</td>
				</tr>
			</table>

			<button class="addsub" type="button" @click="validOrder">
				Valider la commande
			</button>
		</div>
	</div>
</template>
<script>
import axios from "axios";
import { mapState, mapGetters } from "vuex";

export default {
	data() {
		return {
			total: this.$store.state.total,
			products: [],
			order: this.$store.state.order, //JSON.parse(localStorage.getItem("order")),
		};
	},
	computed: {
		...mapGetters(["deliveryDate"]),
		...mapState(["order"]),
	},
	created: function() {
		console.log("hey !!");
		console.log(this.order);
		//*Select all products actived
		axios.get(process.env.VUE_APP_API + "product/actived").then((prod) => {
			for (let c = 0; c < prod.data.length; c++) {
				this.products.push({
					id: prod.data[c].id,
					product: prod.data[c].product,
					price_kg: prod.data[c].price_kg,
					unity: prod.data[c].unite_vente,
					price_unity: prod.data[c].price_unite_vente,
					qty: localStorage.getItem(prod.data[c].id),
				});
			}
		});
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
#total {
	font-weight: bold;
}
</style>
