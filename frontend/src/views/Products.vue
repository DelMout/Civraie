<template>
	<div>
		<h1>Liste des produits</h1>
		<p>{{ infoProd }}</p>

		<table>
			<tr>
				<th>Produit</th>
				<th>Producteur</th>
				<th class="numb">Prix/kg</th>
				<th>Quantité minimum vente</th>
				<th class="numb">Prix Quantité mini</th>
				<th class="numb">Stock initial</th>
				<th class="numb">Stock après conso</th>
				<th class="numb">Stock limite</th>
				<th>Support vente</th>
				<!-- <th>Alerte stock</th> -->
			</tr>
			<tr v-for="prod in products" :key="prod.product">
				<td>{{ prod.product }}</td>
				<td>{{ prod.producer }}</td>
				<td class="numb">{{ prod.price_kg }} <span v-if="prod.price_kg"> €</span></td>
				<td>{{ prod.unite_vente }}</td>
				<td class="numb">
					{{ prod.price_unite_vente }} <span v-if="prod.price_unite_vente">€</span>
				</td>
				<td class="numb">{{ prod.stock_init }}</td>
				<td class="numb">{{ prod.stock_updated }}</td>
				<td class="numb">{{ prod.alert_stock }}</td>

				<td>{{ prod.support }}</td>
				<td v-if="prod.alert <= 0">Attention stock faible !</td>
			</tr>
			<!-- Line for creating new product -->
			<tr class="create">
				<td><input class="create" type="text" id="name" v-model="name" /></td>
				<td @click="displayProducers">
					{{ prodcToSelect }}
				</td>

				<td class="numb">
					<input class="create numb" type="text" id="price_kg" v-model="priceKg" />
				</td>
				<td class="">
					<input class="create " type="text" id="qtymini" v-model="qtyMini" />
				</td>
				<td class="numb">
					<input
						class="create numb"
						type="text"
						id="priceqtymini"
						v-model="PriceQtyMini"
					/>
				</td>
				<td class="numb">
					<input class="create numb" type="text" id="stockinit" v-model="stockInit" />
				</td>
				<td class="nocolor numb">{{ stockInit }}</td>
				<td class="numb">
					<input class="create numb" type="text" id="stocklimit" v-model="stockLimit" />
				</td>
				<td @click="displayOrdering">{{ ordering }}</td>
				<td>
					<button class="valCreate" type="button" @click="validateCreate">
						Créer ce produit
					</button>
				</td>
			</tr>
		</table>

		<!-- Table of producers -->
		<div v-if="displayP">
			<table v-for="prodc in producers" :key="prodc.entreprise">
				<tr @click="selectProdc($event, prodc)">
					{{
						prodc.entreprise
					}}
				</tr>
			</table>
		</div>

		<!-- Table of ordering -->
		<div v-if="displayO">
			<table v-for="ord in orderinginfo" :key="ord.ordering">
				<tr @click="selectOrdering($event, ord)">
					{{
						ord.ordering
					}}
				</tr>
			</table>
		</div>

		<p>Nombre produits = {{ length }}</p>
	</div>
</template>
<script>
import axios from "axios";

export default {
	data() {
		return {
			infoProd: "",
			products: [],
			length: "",
			lengthPc: "",
			name: "Nom du produit",
			priceKg: "Prix/kg",
			qtyMini: "Qté mini vente",
			PriceQtyMini: "Prix qté mini",
			stockInit: "Stock initial",
			stockLimit: "Stock limite",
			displayP: false,
			displayO: false,
			producers: [],
			producerId: "",
			orderinginfo: [],
			orderingItem: "",
			ordering: "Support vente (liste)",
			prodcToSelect: "Producteur (liste)",
		};
	},
	beforeCreate: function() {
		this.products = [];
		this.producers = [];
	},
	created: function() {
		//* All products
		axios.get(process.env.VUE_APP_API + "product").then((prod) => {
			// console.log(products);
			this.length = prod.data.length;
			for (let i = 0; i < this.length; i++) {
				axios
					.get(
						process.env.VUE_APP_API + "producer/getproducer/" + prod.data[i].producerId
					)
					.then((producer) => {
						axios
							.get(
								process.env.VUE_APP_API +
									"information/supportvente/" +
									prod.data[i].ordering
							)
							.then((ordering) => {
								this.products.push({
									product: prod.data[i].product,
									producer: producer.data.entreprise,
									price_kg: prod.data[i].price_kg,
									unite_vente: prod.data[i].unite_vente,
									price_unite_vente: prod.data[i].price_unite_vente,
									stock_init: prod.data[i].stock_init,
									stock_updated: prod.data[i].stock_updated,
									alert_stock: prod.data[i].alert_stock,
									alert: prod.data[i].stock_updated - prod.data[i].alert_stock,
									support: ordering.data,
								});
							});
					});
			}
			console.log(this.products);
		});
	},
	methods: {
		//* Display all producers
		displayProducers: function() {
			this.displayP = true;
			//* All producers
			axios.get(process.env.VUE_APP_API + "producer").then((prodc) => {
				this.lengthPc = prodc.data.length;
				for (let i = 0; i < this.lengthPc; i++) {
					this.producers.push({
						entreprise: prodc.data[i].entreprise,
						id: prodc.data[i].id,
					});
				}
				console.log(prodc);
			});
		},

		//* Display all orderings
		displayOrdering: function() {
			this.displayO = true;
			//* All orderings
			axios.get(process.env.VUE_APP_API + "information/supportvente").then((ord) => {
				this.lengthPc = ord.data.length;
				for (let i = 0; i < this.lengthPc; i++) {
					this.orderinginfo.push({
						ordering: ord.data[i].content,
						item: ord.data[i].item,
					});
				}
				console.log(ord);
			});
		},

		//* Producer selected
		selectProdc: function(event, prodc) {
			this.prodcToSelect = prodc.entreprise;
			this.producerId = prodc.id;
			this.displayP = false;
			this.producers = [];
		},

		//* Ordering selected
		selectOrdering: function(event, ord) {
			this.ordering = ord.ordering;
			this.orderingItem = ord.item;
			this.displayO = false;
			this.orderinginfo = [];
		},

		//* Create a product
		validateCreate: function() {
			//! Vérifier conditions avant de créer, toutes les cases sont bien remplies ?

			axios
				.post(process.env.VUE_APP_API + "product/createproduct", {
					product: this.name,
					producerId: this.producerId,
					price_kg: this.priceKg,
					unite_vente: this.qtyMini,
					price_unite_vente: this.PriceQtyMini,
					stock_init: this.stockInit,
					stock_updated: this.stockInit,
					alert_stock: this.stockLimit,
					ordering: this.orderingItem,
				})
				.then(() => {
					this.infoProd = "Produit créé !";
					this.producerId = "";
					this.orderingItem = "";
				})
				.catch((err) => {
					this.infoProd = err;
				});
		},
	},
};
</script>
<style scoped>
td,
th {
	border: 1px solid black;
}
td,
th,
input,
.valCreate {
	height: 40px;
}
th,
td,
input,
.valCreate {
	width: 200px;
}

.numb {
	width: 80px;
}
table {
	border-collapse: collapse;
}
.create,
.valCreate {
	background-color: greenyellow;
}
.nocolor {
	background-color: white;
}
</style>
