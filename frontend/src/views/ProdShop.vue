<template>
	<div>
		<h1>Produits vendus en magasin</h1>

		<table>
			<tr>
				<th>Produit</th>
				<th>ProducerId</th>
				<th>Unité vente</th>
				<th>Prix unité vente</th>
			</tr>
			<tr v-for="prod in products" :key="prod.product">
				<td>{{ prod.product }}</td>
				<td>{{ prod.producerid }}</td>
				<td>{{ prod.unite_vente }}</td>
				<td>10€</td>
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
		//* All products with NO ordering
		axios.get(process.env.VUE_APP_API + "product/0").then((prod) => {
			// console.log(products);
			this.length = prod.data.length;
			for (let i = 0; i < this.length; i++) {
				this.products.push({
					product: prod.data[i].product,
					producerid: prod.data[i].producerId,
					unite_vente: prod.data[i].unite_vente,
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
}
table {
	border-collapse: collapse;
}
</style>
