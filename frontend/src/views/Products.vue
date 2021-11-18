<template>
	<div>
		<h1>Liste des produits</h1>
		<p>{{ infoProd }}</p>

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
				<th>Jour clôture</th>
				<th class="numb">Prix / kg</th>
				<th>Unité vente</th>
				<th>Support vente</th>
				<th class="photo">Photo</th>
				<th class="numb">Actif</th>
			</tr>
			<!-- <dialog open v-if="modifPhoto"
				><p>Photo modifiée !</p>
				<form method="dialog">
					<button @click="closeDialog">Fermer</button>
				</form></dialog
			> -->
			<tr v-for="prod in products" :key="prod.id" :id="prod.delete">
				<td @click="modifProd($event, prod)" v-if="chooseCommande || prod.active == 1">
					<p v-if="!prod.modif || prod.delete">{{ prod.product }}</p>
					<input
						v-if="prod.modif && !prod.delete"
						class="create numb"
						type="text"
						v-model="prod.product"
					/>
				</td>
				<td
					v-if="chooseCommande || prod.active == 1"
					@click="displayProducersModif($event, prod)"
					:id="prod.selectProdu"
				>
					<p v-if="!produSelected">{{ prod.producer }}</p>
					<p v-if="produSelected">{{ produSelected }}</p>
				</td>
				<td
					v-if="chooseCommande || prod.active == 1"
					@click="displayCategoriesModif($event, prod)"
					:id="prod.selectCate"
				>
					<p v-if="!categorySelected">{{ prod.category }}</p>
					<p v-if="categorySelected">{{ categorySelected }}</p>
				</td>
				<td
					v-if="chooseCommande || prod.active == 1"
					@click="displayCloturedayModif($event, prod)"
					:id="prod.selectCloture"
				>
					<p v-if="!clotureSelected">{{ cloturedays[prod.cloturedayId].cloture_day }}</p>
					<p v-if="clotureSelected">{{ clotureSelected }}</p>
				</td>
				<td
					v-if="chooseCommande || prod.active == 1"
					class="numb"
					@click="modifProd($event, prod)"
				>
					<p v-if="!prod.modif || prod.delete">{{ prod.price }} <span> €</span></p>
					<input
						v-if="prod.modif && !prod.delete"
						class="create numb"
						type="text"
						v-model="prod.price"
					/>
				</td>
				<td v-if="chooseCommande || prod.active == 1" @click="modifProd($event, prod)">
					<p v-if="!prod.modif || prod.delete">{{ prod.unite_vente }}</p>
					<input
						v-if="prod.modif && !prod.delete"
						class="create numb"
						type="text"
						v-model="prod.unite_vente"
					/>
				</td>

				<td
					v-if="chooseCommande || prod.active == 1"
					@click="displayOrderingModif($event, prod)"
					:id="prod.selectOrdering"
				>
					<p v-if="!orderingSelected">{{ prod.support }}</p>
					<p v-if="orderingSelected">{{ orderingSelected }}</p>
				</td>
				<td
					v-if="chooseCommande || prod.active == 1"
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
				<td class="numb" v-if="chooseCommande || prod.active == 1">
					<button
						v-if="prod.active > 0"
						class="active on"
						type="button"
						@click="activeInactive($event, prod)"
					></button>
					<button
						v-if="prod.active === 0"
						class="active off"
						type="button"
						@click="activeInactive($event, prod)"
					></button>
				</td>
				<td v-if="prod.modif">
					<button
						v-if="prod.modif && !prod.delete"
						id="validModif"
						class="modif"
						type="button"
						@click="validModif($event, prod)"
					>
						Valider les modifications
					</button>
					<button
						v-if="prod.modif && !prod.delete"
						class="modif wantDelete"
						type="button"
						@click="wantDelete($event, prod)"
					>
						Sup
					</button>
					<button
						v-if="prod.delete"
						class="modif wantDelete"
						type="button"
						@click="Delete($event, prod)"
					>
						Supprimer ce produit
					</button>
				</td>
			</tr>
			<!-- Info : product created -->
			<dialog open v-if="dialog"
				><p>Produit créé !</p>
				<form method="dialog">
					<button @click="closeDialog">Fermer</button>
				</form></dialog
			>
			<tr>
				<th>Produit</th>
				<th>Producteur</th>
				<th>Catégorie</th>
				<th>Jour clôture</th>
				<th class="numb">Prix</th>
				<th>Unité vente</th>
				<th>Support vente</th>
				<th class="photo">Photo</th>
				<th class="numb">Actif</th>
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
				<td @click="displayCloturedays">
					{{ clotureToSelect }}
				</td>

				<td class="numb">
					<input class="create numb" type="text" id="price" v-model="price" />
				</td>
				<td class="">
					<input class="create " type="text" id="qtymini" v-model="qtyMini" />
				</td>

				<td @click="displayOrdering">{{ ordering }}</td>
				<td class="photo">
					<input class="photo" type="file" name="image" @change="onFileChange" />
				</td>
				<td class="numb">
					<button
						v-if="active > 0"
						class="active on"
						type="button"
						@click="createActive()"
					></button>
					<button
						v-if="active === 0"
						class="active off"
						type="button"
						@click="createActive()"
					></button>
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

		<!-- Table of cloture_days -->
		<div v-if="displayCl">
			<table v-for="clotu in cloturedays" :key="clotu.id">
				<tr @click="selectClotureday($event, clotu)">
					{{
						clotu.cloture_day
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
			price: "",
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
			displayCl: false, //Display Cloture_day
			producers: [],
			producerId: "",
			orderinginfo: [],
			categories: [],
			cloturedays: [
				{ id: 0, cloture_day: "Dimanche" },
				{ id: 1, cloture_day: "Lundi" },
				{ id: 2, cloture_day: "Mardi" },
				{ id: 3, cloture_day: "Mercredi" },
				{ id: 4, cloture_day: "Jeudi" },
				{ id: 5, cloture_day: "Vendredi" },
				{ id: 6, cloture_day: "Samedi" },
			],
			categoryId: "",
			orderingItem: "",
			active: 0,
			ordering: "",
			prodcToSelect: "",
			cateToSelect: "",
			clotureToSelect: "",
			clotureId: "",
			categorySelected: "",
			prodId: "",
			modif: false,
			produSelected: "",
			orderingSelected: "",
			clotureSelected: "",
			index: "",
			chooseCommande: true,
			SeeAlaCommande: "Afficher seulement les produits actifs",
			dialog: false,
		};
	},
	beforeCreate: function() {
		this.products = [];
		this.producers = [];
	},
	created: function() {
		console.log("Now = " + this.$store.getters.dayNow);
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
											price: prod.data[i].price,
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
											cloturedayId: prod.data[i].cloturedayId,
											support: ordering.data,
											active: prod.data[i].active,
											modif: 0,
											delete: 0,
											selectProdu: 0,
											selectOrdering: 0,
											selectCate: 0,
											selectCloture: 0,
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
				item.selectCloture = 0;
			});
			prod.selectProdu = "green"; // color background when cell of producer selected
			this.producers = [];
			this.displayP = true;
			this.displayO = false;
			this.displayC = false;
			this.displayCl = false;
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
				item.selectCloture = 0;
			});
			prod.selectCate = "green"; // color background when cell of producer selected
			this.categories = [];
			this.displayP = false;
			this.displayO = false;
			this.displayC = true;
			this.displayCl = false;
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
			axios.get(process.env.VUE_APP_API + "information/getall/Ordering").then((ord) => {
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

		//* Display all cloture_days (when modif product)
		displayCloturedayModif: function(event, prod) {
			this.products.forEach(function(item) {
				item.selectProdu = 0;
				item.selectOrdering = 0;
				item.selectCate = 0;
				item.selectCloture = 0;
			});
			prod.selectCloture = "green"; // color background when cell of producer selected
			// this.cloturedays = [];
			this.displayP = false;
			this.displayO = false;
			this.displayC = false;
			this.displayCl = true;
			prod.modif = true;
			this.modif = true;
			this.index = this.products.findIndex((x) => x.product === prod.product);
			console.log("index= " + this.index);
			this.prodId = prod.product;
			//* All cloturedays
			// axios.get(process.env.VUE_APP_API + "information/getall/Weekday").then((clotu) => {
			// 	for (let i = 0; i < clotu.data.length; i++) {
			// 		this.cloturedays.push({
			// 			day: clotu.data[i].content,
			// 		});
			// 	}
			// });
		},

		//* Display all cloture_days (when creation)
		displayCloturedays: function() {
			this.producers = [];
			this.orderinginfo = [];
			this.categories = [];
			// this.cloturedays = [];
			this.displayCl = true;
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
			axios.get(process.env.VUE_APP_API + "information/getall/Ordering").then((ord) => {
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
			this.producerId = prodc.id;
			this.displayP = false;
			this.producers = [];
			if (this.modif) {
				this.products[this.index].producer = prodc.entreprise;
				this.products[this.index].producerId = this.producerId;
			} else {
				this.prodcToSelect = prodc.entreprise;
			}
		},

		//* Ordering selected
		selectOrdering: function(event, ord) {
			this.orderingItem = ord.item;
			this.displayO = false;
			this.orderinginfo = [];
			console.log("ordering=" + this.ordering);
			console.log("orderingItem=" + this.orderingItem);
			if (this.modif) {
				this.products[this.index].support = ord.ordering;
				this.products[this.index].ordering = this.orderingItem; //id
			} else {
				this.ordering = ord.ordering;
			}
		},

		//* Category selected
		selectCategory: function(event, cate) {
			this.categoryId = cate.id;
			this.displayC = false;
			this.categories = [];
			if (this.modif) {
				this.products[this.index].category = cate.category;
				this.products[this.index].categoryId = this.categoryId;
			} else {
				this.cateToSelect = cate.category;
			}
		},

		//* Cloture_day selected
		selectClotureday: function(event, clotu) {
			// this.clotureToSelect = clotu.id;
			this.clotureId = clotu.id;
			console.log(clotu.id);
			this.displayCl = false;
			// this.cloturedays = [];
			if (this.modif) {
				this.products[this.index].cloturedayId = this.clotureId;
			} else {
				this.clotureToSelect = clotu.cloture_day;
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

			if (this.price <= 0) {
				this.infoProd =
					"Merci de donner au moins un prix soit à 'Prix/kg' soit à 'Prix qté mini'.";
			} else {
				console.log("on y est !");
				const formData = new FormData();
				formData.append("product", this.name);
				formData.append("producerId", this.producerId);
				formData.append("categoryId", this.categoryId);
				formData.append("cloturedayId", this.clotureId);
				formData.append("price", this.price);
				formData.append("unite_vente", this.qtyMini);
				formData.append("ordering", this.orderingItem);
				formData.append("image", this.image);
				formData.append("active", this.active);

				axios
					.post(process.env.VUE_APP_API + "product/createproduct", formData)
					.then(() => {
						//! Afficher boites de dialog
						this.dialog = true;
						this.infoProd = "Produit créé !";
						this.producerId = "";
						this.orderingItem = "";
					})
					.catch((err) => {
						this.infoProd = err;
						console.log(err);
					});
			}
		},
		//* Close Dialog
		closeDialog: function() {
			this.dialog = false;
			location.reload();
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
			formData.append("categoryId", prod.categoryId);
			formData.append("cloturedayId", prod.cloturedayId);
			formData.append("price", prod.price);
			formData.append("unite_vente", prod.unite_vente);
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
					this.orderingSelected = "";
					this.categorySelected = "";
					this.clotureSelected = "";
					this.products.forEach(function(item) {
						item.selectOrdering = 0;
						item.selectProdu = 0;
						item.selectCate = 0;
						item.selectCloture = 0;
					});
					this.infoProd = "Vos modifications ont été prises en compte";
					location.reload();
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

		//* Active or inactive the product (in list of products)
		activeInactive: function(event, prod) {
			if (prod.active === 1) {
				axios
					.put(process.env.VUE_APP_API + "product/changeactive/" + prod.id + "/0")

					.then(() => {
						prod.active = 0;
					})
					.catch((err) => {
						console.log(err);
					});
			} else {
				if (prod.active === 0) {
					axios
						.put(process.env.VUE_APP_API + "product/changeactive/" + prod.id + "/1")

						.then(() => {
							prod.active = 1;
							console.log("OK !");
						})
						.catch((err) => {
							console.log(err);
						});
				}
			}
		},

		//* Active or inactive the product (in creation of new product)
		createActive: function() {
			if (this.active === 1) {
				this.active = 0;
			} else {
				if (this.active === 0) {
					this.active = 1;
				}
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
#validModif {
	background-color: rgb(252, 190, 76);
}
.wantDelete {
	background-color: red;
	color: white;
}
.create,
.valCreate {
	background-color: rgb(252, 190, 76);
}
#green {
	background-color: rgb(252, 190, 76);
}
#red {
	background-color: red;
	color: white;
}
.nocolor {
	background-color: white;
}
.active {
	width: 1.5rem;
	height: 1.5rem;
	border-radius: 50%;
	margin-left: 0;
}
.on {
	background-color: greenyellow;
}
.off {
	background-color: grey;
}
</style>
