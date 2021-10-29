<template>
	<div>
		<h1>Liste des produits</h1>
		<p>{{ infoProd }}</p>
		<p>Renseigner "0" ou "-1" pour case à laisser vide (pour : Prix/kg, Prix qté mini).</p>
		<p>
			<button style="background-color:cyan;" class="" type="button" @click="aLaCommande">
				{{ SeeAlaCommande }}
			</button>
		</p>

		<table>
			<tr>
				<th>Produit</th>
				<th>Producteur</th>
				<th>Catégorie</th>
				<th class="numb">Prix/kg</th>
				<th>Quantité minimum vente</th>
				<th class="numb">Prix Quantité mini</th>
				<!-- <th class="numb">Stock initial</th>
				<th class="numb">Stock après conso</th>
				<th class="numb">Stock limite</th> -->
				<th>Support vente</th>
				<th class="photo">Photo</th>
				<!-- <th>Alerte stock</th> -->
			</tr>
			<tr v-for="prod in products" :key="prod.id" :id="prod.delete">
				<td @click="modifProd($event, prod)" v-if="chooseCommande || prod.ordering == 2">
					<p v-if="!prod.modif || prod.delete">{{ prod.product }}</p>
					<input
						v-if="prod.modif && !prod.delete"
						class="create numb"
						type="text"
						v-model="prod.product"
					/>
				</td>
				<td
					v-if="chooseCommande || prod.ordering == 2"
					@click="displayProducersModif($event, prod)"
					:id="prod.selectProdu"
				>
					<p v-if="!produSelected">{{ prod.producer }}</p>
					<p v-if="produSelected">{{ produSelected }}</p>
				</td>
				<td
					v-if="chooseCommande || prod.ordering == 2"
					@click="displayCategoriesModif($event, prod)"
					:id="prod.selectCate"
				>
					<p v-if="!cateSelected">{{ prod.category }}</p>
					<p v-if="cateSelected">{{ cateSelected }}</p>
				</td>
				<td
					v-if="chooseCommande || prod.ordering == 2"
					class="numb"
					@click="modifProd($event, prod)"
				>
					<p v-if="(!prod.modif && prod.price_kg > 0) || prod.delete">
						{{ prod.price_kg }} <span> €</span>
					</p>
					<input
						v-if="prod.modif && !prod.delete"
						class="create numb"
						type="text"
						v-model="prod.price_kg"
					/>
				</td>
				<td v-if="chooseCommande || prod.ordering == 2" @click="modifProd($event, prod)">
					<p v-if="!prod.modif || prod.delete">{{ prod.unite_vente }}</p>
					<input
						v-if="prod.modif && !prod.delete"
						class="create numb"
						type="text"
						v-model="prod.unite_vente"
					/>
				</td>
				<td
					v-if="chooseCommande || prod.ordering == 2"
					class="numb"
					@click="modifProd($event, prod)"
				>
					<p v-if="(!prod.modif && prod.price_unite_vente > 0) || prod.delete">
						{{ prod.price_unite_vente }} <span>€</span>
					</p>
					<input
						v-if="prod.modif && !prod.delete"
						class="create numb"
						type="text"
						v-model="prod.price_unite_vente"
					/>
				</td>
				<!-- <td
					v-if="chooseCommande || prod.ordering == 2"
					class="numb"
					@click="modifProd($event, prod)"
				>
					<p v-if="!prod.modif || prod.delete">{{ prod.stock_init }}</p>
					<input
						v-if="prod.modif && !prod.delete"
						class="create numb"
						type="text"
						v-model="prod.stock_init"
					/>
				</td> -->
				<!-- <td v-if="chooseCommande || prod.ordering == 2" class="numb">
					{{ prod.stock_updated }}
				</td>
				<td
					v-if="chooseCommande || prod.ordering == 2"
					class="numb"
					@click="modifProd($event, prod)"
				>
					<p v-if="!prod.modif || prod.delete">{{ prod.alert_stock }}</p>
					<input
						v-if="prod.modif && !prod.delete"
						class="create numb"
						type="text"
						v-model="prod.alert_stock"
					/>
				</td> -->

				<td
					v-if="chooseCommande || prod.ordering == 2"
					@click="displayOrderingModif($event, prod)"
					:id="prod.selectOrdering"
				>
					<p v-if="!orderingSelected">{{ prod.support }}</p>
					<p v-if="orderingSelected">{{ orderingSelected }}</p>
				</td>
				<td
					v-if="chooseCommande || prod.ordering == 2"
					@click="modifProd($event, prod)"
					class="photo"
				>
					<img
						class="photo"
						v-if="prod.photo"
						style="width:80px;"
						:src="prod.photo"
						alt="product photo"
					/><input
						v-if="prod.modif && !prod.delete"
						class="create photo"
						type="file"
						name="image"
						@change="onFileChange"
					/>
				</td>
				<!-- <td v-if="prod.alert <= 0 && (chooseCommande || prod.ordering == 2)">
					Attention stock faible !
				</td> -->
				<td v-if="prod.modif">
					<button
						v-if="prod.modif && !prod.delete"
						style="background-color:greenyellow;"
						class="modif"
						type="button"
						@click="validModif($event, prod)"
					>
						Valider les modifications
					</button>
					<button
						v-if="prod.modif && !prod.delete"
						style="background-color:red;color:white;"
						class="modif"
						type="button"
						@click="wantDelete($event, prod)"
					>
						Sup
					</button>
					<button
						v-if="prod.delete"
						style="background-color:white;color:red;"
						class="modif"
						type="button"
						@click="Delete($event, prod)"
					>
						Supprimer ce produit
					</button>
				</td>
			</tr>
			<tr>
				<th>Produit</th>
				<th>Producteur</th>
				<th>Catégorie</th>
				<th class="numb">Prix/kg</th>
				<th>Quantité minimum vente</th>
				<th class="numb">Prix Quantité mini</th>
				<th>Support vente</th>
				<th class="photo">Photo</th>
			</tr>
			<!-- Row for creating new product -->
			<tr class="create">
				<td><input class="create" type="text" id="name" v-model="name" /></td>
				<td @click="displayProducers">
					{{ prodcToSelect }}
				</td>
				<td @click="displayCategories">
					{{ cateToSelect }}
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
				<!-- <td class="numb">
					<input class="create numb" type="text" id="stockinit" v-model="stockInit" />
				</td>
				<td class="nocolor numb">{{ stockInit }}</td> -->
				<!-- <td class="numb">
					<input class="create numb" type="text" id="stocklimit" v-model="stockLimit" />
				</td> -->
				<td @click="displayOrdering">{{ ordering }}</td>
				<td class="photo">
					<input class="photo" type="file" name="image" @change="onFileChange" />
				</td>
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
				<tr @click="selectProdc($event, prodc, prod)">
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

		<!-- Table of categories -->
		<div v-if="displayC">
			<table v-for="cate in categories" :key="cate.id">
				<tr @click="selectCategory($event, cate)">
					{{
						cate.category
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
			lengthCate: "",
			name: "",
			priceKg: "",
			qtyMini: "",
			PriceQtyMini: "",
			stockInit: "",
			stockLimit: "",
			priceKgM: "",
			photo: "", // total name paste in database
			image: null, // file received brut
			displayP: false, // Display Producers
			displayO: false, //Display Ordering
			displayC: false, //Display Categories
			producers: [],
			producerId: "",
			orderinginfo: [],
			categories: [],
			categoryId: "",
			orderingItem: "",
			ordering: "",
			prodcToSelect: "",
			categorySelected: "",
			prodId: "",
			modif: false,
			produSelected: "",
			orderingSelected: "",
			index: "",
			chooseCommande: true,
			SeeAlaCommande: "Afficher seulement les produits à la commande",
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
							//! Aller chercher la liste categories
							.then((ordering) => {
								axios
									.get(
										process.env.VUE_APP_API +
											"category/getcategory/" +
											prod.data[i].categoryId
									)
									.then((cate) => {
										this.products.push({
											id: prod.data[i].id,
											product: prod.data[i].product,
											producerId: prod.data[i].producerId,
											producer: producer.data.entreprise,
											price_kg: prod.data[i].price_kg,
											unite_vente: prod.data[i].unite_vente,
											price_unite_vente: prod.data[i].price_unite_vente,
											stock_init: prod.data[i].stock_init,
											stock_updated: prod.data[i].stock_updated,
											alert_stock: prod.data[i].alert_stock,
											photo: prod.data[i].photo,
											alert:
												prod.data[i].stock_updated -
												prod.data[i].alert_stock,
											ordering: prod.data[i].ordering,
											categoryId: prod.data[i].categoryId,
											category: cate.data.category,
											support: ordering.data,
											modif: 0,
											delete: 0,
											selectProdu: 0,
											selectOrdering: 0,
											selectCate: 0,
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
							});
					});
			}
			console.log(this.products);
		});
	},
	methods: {
		//* Display all producers (when creation product)
		displayProducers: function() {
			this.producers = [];
			this.orderinginfo = [];
			this.categories = [];
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

		//* Display all producers (when modif product)
		displayProducersModif: function(event, prod) {
			this.products.forEach(function(item) {
				item.selectProdu = 0;
				item.selectOrdering = 0;
				item.selectCate = 0;
			});
			prod.selectProdu = "green"; // color background when cell of producer selected
			this.producers = [];
			this.displayP = true;
			this.displayO = false;
			this.displayC = false;
			prod.modif = true;
			this.modif = true;
			this.index = this.products.findIndex((x) => x.product === prod.product);
			console.log("index= " + this.index);
			this.prodId = prod.product;
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

		//* Display all categories (when creation product)
		displayCategories: function() {
			this.producers = [];
			this.orderinginfo = [];
			this.categories = [];
			this.displayC = true;
			//* All producers
			axios.get(process.env.VUE_APP_API + "category/getcategories").then((cate) => {
				this.lengthCate = cate.data.length;
				for (let i = 0; i < this.lengthCate; i++) {
					this.categories.push({
						category: cate.data[i].category,
						id: cate.data[i].id,
					});
				}
			});
		},

		//* Display all categories (when modif product)
		displayCategoriesModif: function(event, prod) {
			this.products.forEach(function(item) {
				item.selectProdu = 0;
				item.selectOrdering = 0;
				item.selectCate = 0;
			});
			prod.selectCate = "green"; // color background when cell of producer selected
			this.categories = [];
			this.displayP = false;
			this.displayO = false;
			this.displayC = true;
			prod.modif = true;
			this.modif = true;
			this.index = this.products.findIndex((x) => x.product === prod.product);
			console.log("index= " + this.index);
			this.prodId = prod.product;
			//* All categories
			axios.get(process.env.VUE_APP_API + "category/getcategories").then((cate) => {
				this.lengthCate = cate.data.length;
				for (let i = 0; i < this.lengthCate; i++) {
					this.categories.push({
						category: cate.data[i].category,
						id: cate.data[i].id,
					});
				}
			});
		},

		//* Display all orderings (when creation)
		displayOrdering: function() {
			this.producers = [];
			this.orderinginfo = [];
			this.categories = [];
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

		//* Display all orderings (when modif)
		displayOrderingModif: function(event, prod) {
			this.products.forEach(function(item) {
				item.selectOrdering = 0;
				item.selectProdu = 0;
				item.selectCate = 0;
			});
			prod.selectOrdering = "green"; // color background when cell of producer selected
			this.orderinginfo = [];
			this.displayO = true;
			this.displayP = false;
			this.displayC = false;
			prod.modif = true;
			this.modif = true;
			this.index = this.products.findIndex((x) => x.product === prod.product);
			this.prodId = prod.product;
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
			if (this.modif) {
				this.products[this.index].producer = this.prodcToSelect;
				this.products[this.index].producerId = this.producerId;
			}
		},

		//* Ordering selected
		selectOrdering: function(event, ord) {
			this.ordering = ord.ordering;
			this.orderingItem = ord.item;
			this.displayO = false;
			this.orderinginfo = [];
			console.log("ordering=" + this.ordering);
			console.log("orderingItem=" + this.orderingItem);
			if (this.modif) {
				this.products[this.index].support = this.ordering;
				this.products[this.index].ordering = this.orderingItem; //id
			}
		},

		//* Category selected
		selectCategory: function(event, cate) {
			this.categorySelected = cate.category;
			this.categoryId = cate.id;
			this.displayC = false;
			this.categories = [];
			if (this.modif) {
				this.products[this.index].category = this.categorySelected;
				this.products[this.index].categoryId = this.categoryId;
			}
		},

		//* Select a photo
		onFileChange: function(event) {
			this.image = event.target.files[0];
		},

		//* Create a product
		validateCreate: function() {
			// let img = document.getElementById("picture").files[0];
			//! Vérifier conditions avant de créer, toutes les cases sont bien remplies ?
			if (this.priceKg <= 0 && this.PriceQtyMini <= 0) {
				this.infoProd =
					"Merci de donner au moins un prix soit à 'Prix/kg' soit à 'Prix qté mini'.";
			} else {
				const formData = new FormData();
				formData.append("product", this.name);
				formData.append("producerId", this.producerId);
				formData.append("price_kg", this.priceKg);
				formData.append("unite_vente", this.qtyMini);
				formData.append("price_unite_vente", this.PriceQtyMini);
				formData.append("stock_init", this.stockInit);
				formData.append("stock_updated", this.stockInit);
				formData.append("alert_stock", this.stockLimit);
				formData.append("ordering", this.orderingItem);
				formData.append("image", this.image);

				axios
					.post(process.env.VUE_APP_API + "product/createproduct", formData)
					.then(() => {
						this.infoProd = "Produit créé !";
						this.producerId = "";
						this.orderingItem = "";
					})
					.catch((err) => {
						this.infoProd = err;
						console.log(this.image);
					});
			}
		},

		//* Want to modify a product
		modifProd: function(event, prod) {
			// document.location.reload();

			// this.products.forEach(function(item) {
			// 	item.modif = false;
			// });
			prod.modif = true;
		},

		//* Validation modifications
		validModif: function(event, prod) {
			const id = prod.id;
			console.log(id);
			const formData = new FormData();
			formData.append("product", prod.product);
			formData.append("producerId", prod.producerId);
			formData.append("price_kg", prod.price_kg);
			formData.append("unite_vente", prod.unite_vente);
			formData.append("price_unite_vente", prod.price_unite_vente);
			formData.append("stock_init", prod.stock_init);
			formData.append("stock_updated", prod.stock_init);
			formData.append("alert_stock", prod.alert_stock);
			formData.append("ordering", prod.ordering);
			formData.append("image", this.image);
			axios
				.put(process.env.VUE_APP_API + "product/modif/" + id, formData)
				// headers: {
				// 	Authorization: `Bearer ${this.token}`,
				// },

				.then(() => {
					prod.modif = false;
					this.produSelected = "";
					this.products.forEach(function(item) {
						item.selectOrdering = 0;
						item.selectProdu = 0;
					});
					this.infoProd = "Vos modifications ont été prises en compte";
				})
				.catch((err) => {
					this.infoProd = err;
					console.log(err);
				});
		},

		//* Want delete a product
		wantDelete: function(event, prod) {
			prod.delete = "red";
			prod.selectProdu = 0;
			prod.selectOrdering = 0;
		},

		//* Delete product
		Delete: function(event, prod) {
			const id = prod.id;
			axios
				.delete(process.env.VUE_APP_API + "product/delete/" + id)
				// headers: {
				// 	Authorization: `Bearer ${this.token}`,
				// },

				.then(() => {
					this.infoProd = "Le produit a été supprimé.";
				})
				.catch((err) => {
					this.infoProd = err;
					console.log(err);
				});
		},

		//* Display producers with ordering = a la commande
		aLaCommande: function() {
			if (this.chooseCommande) {
				this.chooseCommande = false;
				this.SeeAlaCommande = "Afficher tous les produits";
			} else {
				this.chooseCommande = true;
				this.SeeAlaCommande = "Afficher seulement les produits à la commande";
			}
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
.photo {
	width: 120px;
}
table {
	border-collapse: collapse;
}
.create,
.valCreate {
	background-color: greenyellow;
}
#green {
	background-color: greenyellow;
}
#red {
	background-color: red;
	color: white;
}
.nocolor {
	background-color: white;
}
</style>
