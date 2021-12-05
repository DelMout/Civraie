<template>
	<div id="productsTable">
		<div id="entete">
			<Button
				id=""
				label="Selection / Producteur"
				class="p-button-raised validModif valButton p-button-warning"
				@click="selectProducer"
			/>
			<Button
				id=""
				label="Créer un produit"
				class="p-button-raised validModif valButton p-button-warning"
				@click="downPage"
			/>
			<h3>Liste des produits</h3>
			<p id="number">Attention, "Actif" à faire qu'à partir du Dimanche !</p>
		</div>

		<ConfirmPopup></ConfirmPopup>
		<ConfirmPopup group="demo">
			<template #message="slotProps">
				<div class="p-d-flex p-p-4">
					<i :class="slotProps.message.icon" style="font-size: 1.5rem"></i>
					<p class="p-pl-2">{{ slotProps.message.message }}</p>
				</div>
			</template>
		</ConfirmPopup>

		<div id="tableau">
			<table>
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
				<tr v-for="prod in products" :key="prod.id" :id="prod.delete">
					<td @click="modifProd($event, prod)" :class="prod.modif">
						<p v-if="!prod.modif || prod.delete">{{ prod.product }}</p>
						<input
							v-if="prod.modif && !prod.delete"
							class="create "
							type="text"
							v-model="prod.product"
						/>
					</td>
					<td @click="modifProd($event, prod)" :class="prod.modif">
						<p v-if="!prod.modif || prod.delete">{{ prod.producer }}</p>
						<Dropdown
							v-if="prod.modif && !prod.delete"
							class="dropclass"
							@click="displayProducers"
							v-model="producerModel"
							:options="producers"
							optionLabel="entreprise"
							optionValue="id"
							:placeholder="prod.producer"
						/>
						<!-- <p v-if="produSelected">{{ produSelected }}</p> -->
					</td>
					<!-- <td
						v-if="chooseCommande || prod.active == 1"
						@click="displayProducersModif($event, prod)"
						:id="prod.selectProdu"
					>
						<p v-if="!produSelected">{{ prod.producer }}</p>
						<p v-if="produSelected">{{ produSelected }}</p>
					</td> -->
					<td @click="modifProd($event, prod)" :class="prod.modif">
						<p v-if="!prod.modif || prod.delete">{{ prod.category }}</p>
						<Dropdown
							v-if="prod.modif && !prod.delete"
							@click="displayCategories"
							v-model="categoryModel"
							:options="categories"
							optionLabel="category"
							optionValue="id"
							:placeholder="prod.category"
						/>
					</td>
					<td @click="modifProd($event, prod)" :class="prod.modif">
						<p v-if="!prod.modif || prod.delete">
							{{ cloturedays[prod.cloturedayId].cloture_day }}
						</p>
						<Dropdown
							v-if="prod.modif && !prod.delete"
							v-model="clotureModel"
							:options="cloturedays"
							optionLabel="cloture_day"
							optionValue="id"
							:placeholder="cloturedays[prod.cloturedayId].cloture_day"
						/>
					</td>
					<td class="numb" @click="modifProd($event, prod)" :class="prod.modif">
						<p v-if="!prod.modif || prod.delete">{{ prod.price }} <span> €</span></p>
						<input
							v-if="prod.modif && !prod.delete"
							class="create numb"
							type="text"
							v-model="prod.price"
						/>
					</td>
					<td @click="modifProd($event, prod)" :class="prod.modif">
						<p v-if="!prod.modif || prod.delete">{{ prod.unite_vente }}</p>
						<input
							v-if="prod.modif && !prod.delete"
							class="create "
							type="text"
							v-model="prod.unite_vente"
						/>
					</td>

					<td @click="modifProd($event, prod)" :class="prod.modif">
						<p v-if="!prod.modif || prod.delete">{{ prod.support }}</p>
						<Dropdown
							v-if="prod.modif && !prod.delete"
							@click="displayOrdering"
							v-model="orderingModel"
							:options="orderinginfo"
							optionLabel="ordering"
							optionValue="item"
							:placeholder="prod.support"
						/>
					</td>
					<td @click="modifProd($event, prod)" class="photo">
						<img
							class="photo"
							v-if="prod.photo"
							style="width:80px;"
							:src="prod.photo"
							alt="product photo"
						/>

						<div class="uploadFile" v-if="prod.modif && !prod.delete">
							<button class="btn-upload">Choisir un fichier</button>
							<input type="file" name="image" @change="onFileChange" />
						</div>
					</td>
					<td class="numb">
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
					<td v-if="prod.modif" class="valButton ">
						<Button
							v-if="prod.modif && !prod.delete"
							id=""
							label="Modifier"
							class="p-button-raised validModif valButton p-button-warning"
							@click="validModif($event, prod)"
						/>
						<Button
							v-if="prod.modif"
							id=""
							label="Supprimer"
							class="p-button-raised  valButton p-button-danger"
							@click="wantDelete($event, prod)"
						/>
						<!-- <Button
							v-if="prod.delete"
							id="toDelete"
							label="Supprimer ce produit"
							class="p-button-raised  valButton p-button-danger p-button-text"
							@click="Delete($event, prod)"
						/> -->
					</td>
				</tr>

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
				<tr class="create createProd">
					<td class="createProd">
						<input class="createProd" type="text" id="name" v-model="name" />
					</td>

					<td class="createProd">
						<Dropdown
							class="dropclass"
							v-model="prodcToSelect"
							:options="producers"
							optionLabel="entreprise"
							optionValue="id"
							:placeholder="prodcToSelect"
						/>
					</td>
					<td class="createProd">
						<Dropdown
							v-model="cateToSelect"
							:options="categories"
							optionLabel="category"
							optionValue="id"
							:placeholder="cateToSelect"
						/>
					</td>
					<td class="createProd">
						<Dropdown
							v-model="clotureToSelect"
							:options="cloturedays"
							optionLabel="cloture_day"
							optionValue="id"
							:placeholder="clotureToSelect"
						/>
					</td>

					<td class="numb createProd">
						<input class="createProd numb" type="text" id="price" v-model="price" />
					</td>
					<td class="createProd">
						<input class="createProd " type="text" id="qtymini" v-model="qtyMini" />
					</td>
					<td class="createProd">
						<Dropdown
							v-model="ordering"
							:options="orderinginfo"
							optionLabel="ordering"
							optionValue="item"
							:placeholder="ordering"
						/>
					</td>
					<td class="photo createProd">
						<div class="uploadFile">
							<button class="btn-upload">Choisir un fichier</button>
							<input type="file" name="image" @change="onFileChange" />
						</div>
					</td>
					<td class="createProd numb">
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
					<td class=" valCreate valButton">
						<Button
							id="toCreate"
							label="Créer"
							class="p-button-raised validModif valButton p-button-warning"
							@click="validateCreate"
						/>
					</td>
				</tr>
			</table>
		</div>
		<!-- Info : product created or deleted -->
		<div>
			<Dialog header="Confirmation" v-model:visible="dialog" :style="{ width: '15vw' }"
				><p>{{ infoProd }}</p>
				<template #footer>
					<Button label="OK" @click="closeCreated" autofocus />
				</template>
			</Dialog>
		</div>
	</div>
</template>
<script>
import axios from "axios";

export default {
	data() {
		return {
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
			ordering: "Support vente ?",
			prodcToSelect: "Producteur ?",
			cateToSelect: "Categorie ?",
			clotureToSelect: "Jour clôture ?",
			clotureId: "",
			categorySelected: "",
			prodId: "",
			modif: false,
			produSelected: "",
			orderingSelected: "",
			clotureSelected: "",
			index: "",
			dialog: false,
			producerModel: "",
			categoryModel: "",
			orderingModel: "",
			clotureModel: "",
			modifInProgress: false,
			infoProd: "",
			tamponId: "",
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
		this.displayProducers();
		this.displayCategories();
		this.displayOrdering();
	},
	methods: {
		//* Display all producers (when creation product)
		displayProducers: function() {
			this.producers = [];
			//* All producers
			axios.get(process.env.VUE_APP_API + "producer").then((prodc) => {
				this.lengthPc = prodc.data.length;
				for (let i = 0; i < this.lengthPc; i++) {
					this.producers.push({
						entreprise: prodc.data[i].entreprise,
						id: prodc.data[i].id,
					});
				}
				// console.log(prodc);
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
			this.categories = [];
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
			this.orderinginfo = [];
			//* All orderings
			axios.get(process.env.VUE_APP_API + "information/getall/Ordering").then((ord) => {
				this.lengthPc = ord.data.length;
				for (let i = 0; i < this.lengthPc; i++) {
					this.orderinginfo.push({
						ordering: ord.data[i].content,
						item: ord.data[i].item,
					});
				}
				// console.log(ord);
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

			console.log("on y est !");
			const formData = new FormData();
			formData.append("product", this.name);
			formData.append("producerId", this.prodcToSelect);
			formData.append("categoryId", this.cateToSelect);
			formData.append("cloturedayId", this.clotureToSelect);
			formData.append("price", this.price);
			formData.append("unite_vente", this.qtyMini);
			formData.append("ordering", this.ordering);
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
					console.log(err);
				});
		},
		//* Close Dialog
		closeCreated: function() {
			this.dialog = false;
			location.reload();
		},

		//* Want to modify a product
		modifProd: function(event, prod) {
			if (!this.modifInProgress) {
				prod.modif = "yellow";
				this.tamponId = prod.id;
				this.producerModel = prod.producerId;
				this.categoryModel = prod.categoryId;
				this.orderingModel = prod.ordering;
				this.clotureModel = prod.cloturedayId;
				this.modifInProgress = true;
			} else {
				if (prod.id != this.tamponId) {
					this.products.forEach((item) => {
						if (item.id === this.tamponId) {
							item.modif = 0;
							this.modifInProgress = false;
						}
					});
				}
			}
		},

		//* Validation modifications
		validModif: function(event, prod) {
			const id = prod.id;
			console.log(id);
			console.log(this.producerModel);
			console.log(this.categoryModel);
			console.log(this.clotureModel);
			console.log(this.orderingModel);
			const formData = new FormData();
			formData.append("product", prod.product);
			formData.append("producerId", this.producerModel);
			formData.append("categoryId", this.categoryModel);
			formData.append("cloturedayId", this.clotureModel);
			formData.append("price", prod.price);
			formData.append("unite_vente", prod.unite_vente);
			formData.append("ordering", this.orderingModel);
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
					location.reload();
				})
				.catch((err) => {
					console.log(err);
				});
		},

		//* Want delete a product
		wantDelete: function(event, prod) {
			prod.delete = "red";
			prod.modif = "red";
			// prod.selectProdu = 0;
			// prod.selectOrdering = 0;
			// prod.modif = false;
			this.$confirm.require({
				target: event.currentTarget,
				message: "Souhaitez-vous supprimer ce producteur ?",
				icon: "pi pi-info-circle",
				acceptClass: "p-button-danger",
				accept: () => {
					this.Delete(event, prod);
				},
				reject: () => {
					prod.delete = 0;
				},
			});
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
					this.dialog = true;
					this.infoProd = "Le produit a été supprimé.";
				})
				.catch((err) => {
					console.log(err);
				});
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

		//* Go down to the bottom of the page
		downPage: function() {
			window.scrollTo(0, document.body.scrollHeight);
		},
	},
};
</script>
<style scoped>
h3 {
	margin: 0;
	margin-right: 2rem;
	text-align: right;
	margin-left: 5rem;
}
#entete {
	display: flex;
	justify-content: space-around;
	margin-top: 0rem;
	margin-bottom: 1rem;
	margin-left: 5rem;
}
#number {
	margin: 0;
	font-size: 12px;
	margin-top: 0.2rem;
}
#productsTable {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
#tableau {
	margin: auto;
	width: 100%;
}
td,
th {
	border: 1px solid black;
}
td,
input {
	height: 5rem;
}
th {
	height: 3rem;
	background-color: rgb(235, 141, 47);
	color: black;
}
th,
td,
input {
	width: 10rem;
}
tr {
	width: 50%;
	background-color: white;
	color: black;
}
.numb {
	width: 5rem;
}
.photo {
	width: 5rem;
}
table {
	border-collapse: collapse;
	width: 80vw;
	margin-right: auto;
	margin-left: auto;
	margin-bottom: 5rem;
}
.valButton {
	font-size: 1rem;
	padding-right: 0;
	padding-left: 0;
	width: 6rem;
	background-color: #122f1c;
	border: 0px solid;
	margin-left: 5px;
}
.validModif {
	background-color: #fbc02d;
	color: black;
	margin-bottom: 4px;
}
#toDelete {
	background-color: white;
	font-weight: bolder;
}
#toCreate {
	font-weight: bolder;
	color: black;
}
.create {
	background-color: #fbc02d;
	width: 10rem;
}
.createProd {
	height: 2.5rem;
	background-color: #fbc02d;
}
.valCreate {
	height: 2.5rem;
}
.uploadFile {
	display: inline-block;
	position: relative;
	overflow: hidden;
}
.uploadFile input[type="file"] {
	left: 0;
	top: 0;
	opacity: 0;
	position: absolute;
	cursor: pointer;
}
.btn-upload {
	background-color: #fbc02d;
	border: 1px solid grey;
	color: #000;
	padding: 1px 1px;
	border-radius: 7px;
	font-size: 0.8rem;
}
#green {
	background-color: #fbc02d;
}
#red {
	background-color: #d32f2f;
	color: white;
}
.yellow {
	background-color: #fbc02d;
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
::v-deep(.p-dropdown) {
	background-color: #fbc02d;
}
</style>
