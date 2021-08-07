<template>
	<div>
		<h1>Produits vendus à la commande</h1>
		<!-- A afficher si non connecté -->
		<h2>Pour pouvoir commander, vous devez vous connecter à votre compte</h2>
		<h3>
			Passer votre commande avant le {{ dateCommande }} soir. Livraison le {{ dateLivraison }}
		</h3>
		<!-- Présentation produits sur petites cartes -->
		<table v-if="total > 0">
			<caption>
				Votre commande
			</caption>
			<tr>
				<th>Produit</th>
				<th>Quantité</th>
				<th>Unité</th>
				<th>Prix</th>
			</tr>
			<tr v-for="prod in products" :key="prod.id">
				<td v-if="prod.qty > 0">{{ prod.product }}</td>
				<td v-if="prod.qty > 0">{{ prod.qty }} x</td>
				<td v-if="prod.qty > 0">{{ prod.unite_vente }}</td>
				<td v-if="prod.qty > 0">{{ numFr(prod.qty * prod.price_unite_vente) }}</td>
			</tr>

			<td colspan="4">
				Prix total de la commande : <span>{{ numFr(total) }}</span>
			</td>
		</table>

		<div id="conteneur">
			<div v-for="prod in products" :key="prod.product">
				<div class="card">
					<p id="faible" v-if="prod.alert <= 0">Attention stock faible !</p>
					<p class="product">{{ prod.product }}</p>
					<p>{{ prod.producer }}</p>

					<img
						class="photo"
						v-if="prod.photo"
						style="width:100px;"
						:src="prod.photo"
						alt="product photo"
					/>
					<p>
						<span v-if="prod.price_kg > 0"> {{ numFr(prod.price_kg) }}/kg </span>

						<span v-if="prod.price_kg <= 0">
							{{ numFr(prod.price_unite_vente) }}/{{ prod.unite_vente }}
						</span>
					</p>
					<p>Quantité mini :<br />{{ prod.unite_vente }}</p>
					<p id="butAddSub">
						<button
							v-if="prod.qty > 0"
							class="addsub"
							type="button"
							@click="subQty($event, prod)"
						>
							-
						</button>
						<button
							v-if="prod.qty < prod.stock_updated"
							class="addsub"
							type="button"
							@click="addQty($event, prod)"
						>
							+
						</button>
					</p>
				</div>
			</div>
		</div>

		<p>Nombre produits = {{ length }}</p>
	</div>
</template>
<script>
import axios from "axios";

export default {
	data() {
		return {
			dateCommande: "25/08/2021",
			dateLivraison: "30/08/2021",
			products: [],
			length: "",
			bought: [],
			total: 0,
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
							id: prod.data[i].id,
							product: prod.data[i].product,
							producer: producer.data.entreprise,
							price_kg: prod.data[i].price_kg,
							unite_vente: prod.data[i].unite_vente,
							price_unite_vente: prod.data[i].price_unite_vente,
							photo: prod.data[i].photo,
							alert: prod.data[i].stock_updated - prod.data[i].alert_stock,
							stock_updated: prod.data[i].stock_updated,
							qty: 0,
						});
						// sort alpha order
						this.products.sort(function(a, b) {
							var productA = a.product.toUpperCase();
							var productB = b.product.toUpperCase();

							if (productA < productB) {
								return -1;
							}
							if (productA > productB) {
								return 1;
							}
							return 0;
						});
					});
			}
			console.log(this.products);
		});
	},
	methods: {
		//* Number format
		numFr: function(num) {
			return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
				num
			);
		},
		//* Add product to the order
		addQty: function(event, prod) {
			prod.qty += 1;
			this.total = parseInt(this.total) + parseInt(prod.price_unite_vente);
			console.log(this.total);
		},
		//* Substract product to the order
		subQty: function(event, prod) {
			prod.qty -= 1;
			this.total = parseInt(this.total) - parseInt(prod.price_unite_vente);
		},
	},
};
</script>
<style scoped>
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
}

#conteneur {
	display: flex;
	flex-wrap: wrap;
}
.card {
	border: 3px solid green;
	box-shadow: 5px 5px 5px grey;
	width: 200px;
	height: 350px;
	margin: 4px;
	display: flex;
	flex-direction: column;
}
.product {
	font-weight: bold;
	margin-bottom: 0;
}
#faible {
	background-color: red;
	color: white;
	padding-top: 2px;
	padding-bottom: 2px;
	margin-top: 0;
	margin-bottom: 0;
}
img {
	margin: auto;
}
.addsub {
	background-color: green;
	color: white;
	font-size: 16px;
	font-weight: bold;
	padding: 1px 6px 1px 6px;
}
#butAddSub {
	margin-top: auto;
}
</style>
