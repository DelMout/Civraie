<template>
	<div>
		<h1>Produits vendus à la commande</h1>
		<!-- A afficher si non connecté -->
		<h2>Pour pouvoir commander, vous devez vous connecter à votre compte</h2>

		<table>
			<tr>
				<th>Produit</th>
				<th>Producteur</th>
				<th>Prix/kg</th>
				<th>Quantité minimum vente</th>
				<th>Prix Quantité mini</th>
				<!-- <th>Alerte stock</th> -->
			</tr>
			<tr v-for="prod in products" :key="prod.product">
				<td>{{ prod.product }}</td>
				<td>{{ prod.producer }}</td>
				<td>{{ prod.price_kg }} <span v-if="prod.price_kg"> €</span></td>
				<td>{{ prod.unite_vente }}</td>
				<td>{{ prod.price_unite_vente }} <span v-if="prod.price_unite_vente">€</span></td>
				<td v-if="prod.alert <= 0">Attention stock faible !</td>
			</tr>
		</table>

		<p>Nombre produits = {{ length }}</p>
	</div>
</template>
<script>
import axios from "axios";

export default {
	data() {
		return {
			products: [],
			length: "",
		};
	},
	beforeCreate: function() {
		this.products = [];
	},
	created: function() {
		//* All products with ordering (2)
		axios.get(process.env.VUE_APP_API + "product/2").then((prod) => {
			// console.log(products);
			this.length = prod.data.length;
			for (let i = 0; i < this.length; i++) {
				axios
					.get(
						process.env.VUE_APP_API + "producer/getproducer/" + prod.data[i].producerId
					)
					.then((producer) => {
						this.products.push({
							product: prod.data[i].product,
							producer: producer.data.entreprise,
							price_kg: prod.data[i].price_kg,
							unite_vente: prod.data[i].unite_vente,
							price_unite_vente: prod.data[i].price_unite_vente,
							alert: prod.data[i].stock_updated - prod.data[i].alert_stock,
						});
					});
			}
			console.log(this.products);
		});
	},
};
</script>
<style scoped>
td {
	border: 1px solid black;
	width: 200px;
	height: 40px;
}
th {
	width: 200px;
	height: 40px;
}
table {
	border-collapse: collapse;
}
</style>
