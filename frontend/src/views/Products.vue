<template>
	<div>
		<div id="productsTable">
			<div id="title">
				<h3>Liste des produits</h3>
			</div>
			<div id="selection">
				<Button
					id="selAll"
					label="Tous les produits"
					class="p-button-raised   p-button-primary"
					@click="selectAllProducts"
				/>
				<Dropdown
					id="selProd"
					v-model="produSelected"
					:options="producers"
					optionLabel="entreprise"
					optionValue="id"
					placeholder="Sélection / Producteur"
				/><Button
					style="background-color:#a3d7a5;color:black;border:none"
					icon="pi pi-check"
					class="p-button-rounded"
					@click="displayProdProdu"
				/>
				<Button
					id="toBottom"
					label="Créer un produit"
					class="p-button-raised   p-button-warning"
					@click="downPage"
				/>
				<Button
					id="allactived"
					label="Tous actifs"
					class="p-button-raised   p-button on"
					@click="putAllActived"
				/>
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
						<th>Unité / prix</th>
						<th>Unité vente</th>
						<th>Support vente</th>
						<th class="numb">Stock</th>
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
								v-model="producerModel"
								:options="producers"
								optionLabel="entreprise"
								optionValue="id"
								:placeholder="prod.producer"
							/>
						</td>

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
							<p v-if="!prod.modif || prod.delete">
								{{ prod.price }} <span> €</span>
							</p>
							<input
								v-if="prod.modif && !prod.delete"
								class="create numb"
								type="text"
								v-model="prod.price"
							/>
						</td>
						<td @click="modifProd($event, prod)" :class="prod.modif">
							<p v-if="!prod.modif || prod.delete">
								{{ prod.unite_vente }}
							</p>
							<input
								v-if="prod.modif && !prod.delete"
								class="create "
								type="text"
								v-model="prod.unite_vente"
							/>
						</td>
						<td @click="modifProd($event, prod)" :class="prod.modif">
							<p v-if="!prod.modif || prod.delete">
								{{ prod.unity }}
							</p>
							<input
								v-if="prod.modif && !prod.delete"
								class="create "
								type="text"
								v-model="prod.unity"
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
						<td class="numb">
							<button
								v-if="prod.stock_manag > 0"
								class="stock on_stock"
								type="button"
								@click="changeStockManag($event, prod)"
							></button>
							<button
								v-if="prod.stock_manag === 0"
								class="stock off_stock"
								type="button"
								@click="changeStockManag($event, prod)"
							></button>
						</td>
						<td @click="modifProd($event, prod)" class="photo">
							<img
								class="photo"
								v-if="prod.photo"
								style="max-width:5rem;max-height:5rem;width:auto;"
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
						</td>
					</tr>

					<tr>
						<th>Produit</th>
						<th>Producteur</th>
						<th>Catégorie</th>
						<th>Jour clôture</th>
						<th class="numb">Prix</th>
						<th>Unité / prix</th>
						<th>Unité vente</th>
						<th>Support vente</th>
						<th class="numb">Stock</th>
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
							<input class="createProd " type="text" id="unity" v-model="unity" />
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
						<td class="createProd numb">
							<button
								v-if="stock_man > 0"
								class="stock on_stock"
								type="button"
								@click="createStockManag()"
							></button>
							<button
								v-if="stock_man === 0"
								class="stock off_stock"
								type="button"
								@click="createStockManag()"
							></button>
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
		<div style="width:30vw">
			<Toast position="center" :breakpoints="{ '400px': { width: '95%' } }">
				<template #message="slotProps">
					<div class="p-d-flex p-flex-row">
						<div class="p-text-center">
							<i class="pi pi-exclamation-triangle" style="font-size: 2rem"></i>
							<p>{{ slotProps.message.detail }}</p>
						</div>
					</div>
				</template>
			</Toast>
		</div>
	</div>
</template>
<script>
import axios from "axios";
import moment from "moment";
import { mapState, mapActions } from "vuex";

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
			unity: "",
			image: null, // file received brut
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
				// { id: 5, cloture_day: "Vendredi" },
				// { id: 6, cloture_day: "Samedi" },
			],
			categoryId: "",
			orderingItem: "",
			active: 0,
			stock_man: 0,
			ordering: "Support vente ?",
			prodcToSelect: "Producteur ?",
			cateToSelect: "Categorie ?",
			clotureToSelect: "Jour clôture ?",
			clotureId: "",
			modif: false,
			produSelected: "",
			index: "",
			dialog: false,
			producerModel: "",
			categoryModel: "",
			orderingModel: "",
			clotureModel: "",
			modifInProgress: false,
			infoProd: "",
			tamponId: "",
			unitee: "",
		};
	},
	beforeMount: function() {
		this.$store.dispatch("checkConnect");
	},
	beforeCreate: function() {
		this.products = [];
		this.producers = [];
	},
	created: function() {
		this.$store.dispatch("checkConnect");
		if (!this.connected) {
			this.$router.push("/");
		} else {
			this.$store.state.inPages = true;
			//* All products
			axios({
				method: "get",
				url: process.env.VUE_APP_API + "product",
				headers: {
					Authorization: `Bearer ${this.token}`,
				},
			}).then((prod) => {
				this.length = prod.data.length;
				for (let i = 0; i < this.length; i++) {
					axios
						.get(
							process.env.VUE_APP_API +
								"producer/getproducer/" +
								prod.data[i].producerId
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
												unity: prod.data[i].unity,
												stock_manag: prod.data[i].stock_manag,
												stock_init: prod.data[i].stock_init,
												stock_updated: prod.data[i].stock_updated,
												stock_in_date: prod.data[i].stock_in_date,
												photo: prod.data[i].photo,
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
			});
			this.displayProducers();
			this.displayCategories();
			this.displayOrdering();
		}
	},
	computed: {
		...mapState(["token", "connected"]),
	},
	methods: {
		...mapActions(["checkConnect"]),
		//* Display all producers
		displayProducers: function() {
			this.producers = [];
			//* All producers
			axios({
				method: "get",
				url: process.env.VUE_APP_API + "producer",
				headers: {
					Authorization: `Bearer ${this.token}`,
				},
			}).then((prodc) => {
				this.lengthPc = prodc.data.length;
				for (let i = 0; i < this.lengthPc; i++) {
					this.producers.push({
						entreprise: prodc.data[i].entreprise,
						id: prodc.data[i].id,
					});
				}
			});
		},

		//* Display all categories
		displayCategories: function() {
			this.categories = [];
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

		//* Display all orderings
		displayOrdering: function() {
			this.orderinginfo = [];
			axios.get(process.env.VUE_APP_API + "information/getall/Ordering").then((ord) => {
				this.lengthPc = ord.data.length;
				for (let i = 0; i < this.lengthPc; i++) {
					this.orderinginfo.push({
						ordering: ord.data[i].content,
						item: ord.data[i].item,
					});
				}
			});
		},

		//* Producer selected
		selectProdc: function(event, prodc) {
			this.producerId = prodc.id;
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
			this.orderinginfo = [];
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
			this.clotureId = clotu.id;
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
			this.$store.dispatch("checkConnect");
			if (!this.connected) {
				this.$router.push("/");
			} else {
				const formData = new FormData();
				formData.append("product", this.name);
				formData.append("producerId", this.prodcToSelect);
				formData.append("categoryId", this.cateToSelect);
				formData.append("cloturedayId", this.clotureToSelect);
				formData.append("price", this.price);
				formData.append("unite_vente", this.qtyMini);
				formData.append("unity", this.unity);
				formData.append("ordering", this.ordering);
				formData.append("stock_manag", this.stock_man);
				formData.append("image", this.image);
				formData.append("active", this.active);
				if (this.active === 1) {
					formData.append("active_date", moment().format("YYYY-MM-DD"));
				}

				axios({
					method: "post",
					url: process.env.VUE_APP_API + "product/createproduct",
					data: formData,
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				})
					.then(() => {
						this.dialog = true;
						this.infoProd = "Produit créé !";
						this.producerId = "";
						this.orderingItem = "";
					})
					.catch(() => {
						this.$toast.add({
							severity: "error",
							detail:
								"Merci de renseigner : Nom du produit, Prix, Unité/prix, Producteur, Catégorie, Jour clôture et Support vente.",
							closable: false,
							life: 4000,
						});
					});
			}
		},

		//* Close Dialog
		closeCreated: function() {
			this.dialog = false;
			if (this.produSelected != 0) {
				this.displayProdProdu();
			} else {
				location.reload();
			}
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
			this.$store.dispatch("checkConnect");
			if (!this.connected) {
				this.$router.push("/");
			} else {
				const id = prod.id;
				if (prod.unity) {
					this.unitee = prod.unity;
				} else {
					this.unitee = "";
				}
				const formData = new FormData();
				formData.append("product", prod.product);
				formData.append("producerId", this.producerModel);
				formData.append("categoryId", this.categoryModel);
				formData.append("cloturedayId", this.clotureModel);
				formData.append("price", prod.price);
				formData.append("unite_vente", prod.unite_vente);
				formData.append("unity", this.unitee);
				formData.append("ordering", this.orderingModel);
				formData.append("image", this.image);
				axios({
					method: "put",
					url: process.env.VUE_APP_API + "product/modif/" + id,
					data: formData,
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				})
					.then(() => {
						prod.modif = false;
						this.products.forEach(function(item) {
							item.selectOrdering = 0;
							item.selectProdu = 0;
							item.selectCate = 0;
							item.selectCloture = 0;
						});
						if (this.produSelected != 0) {
							this.displayProdProdu();
						} else {
							location.reload();
						}
					})
					.catch(() => {
						this.$toast.add({
							severity: "error",
							detail: "Problème ! Les modifications n'ont pas été prises en compte",
							closable: false,
							life: 4000,
						});
					});
			}
		},

		//* Want delete a product
		wantDelete: function(event, prod) {
			prod.delete = "red";
			prod.modif = "red";
			this.$confirm.require({
				target: event.currentTarget,
				message: "Souhaitez-vous supprimer ce produit ?",
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
			this.$store.dispatch("checkConnect");
			if (!this.connected) {
				this.$router.push("/");
			} else {
				const id = prod.id;
				axios({
					method: "delete",
					url: process.env.VUE_APP_API + "product/delete/" + id,
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				})
					.then(() => {
						this.dialog = true;
						this.infoProd = "Le produit a été supprimé.";
					})
					.catch(() => {
						this.$toast.add({
							severity: "error",
							detail: "Problème ! Le produit n'a pas été supprimé",
							closable: false,
							life: 4000,
						});
					});
			}
		},

		//* Active or inactive the product (in list of products)
		activeInactive: function(event, prod) {
			this.$store.dispatch("checkConnect");
			if (!this.connected) {
				this.$router.push("/");
			} else {
				if (prod.active === 1) {
					axios({
						method: "put",
						url: process.env.VUE_APP_API + "product/changeactive/" + prod.id + "/0",
						headers: {
							Authorization: `Bearer ${this.token}`,
						},
					}).then(() => {
						prod.active = 0;
					});
				} else {
					if (prod.active === 0) {
						axios({
							method: "put",
							url: process.env.VUE_APP_API + "product/changeactive/" + prod.id + "/1",
							headers: {
								Authorization: `Bearer ${this.token}`,
							},
						}).then(() => {
							prod.active = 1;
						});
					}
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

		//* Change status of stock_manag for the product (in list of products)
		changeStockManag: function(event, prod) {
			this.$store.dispatch("checkConnect");
			if (!this.connected) {
				this.$router.push("/");
			} else {
				if (prod.stock_manag === 1) {
					axios({
						method: "put",
						url: process.env.VUE_APP_API + "product/changestockmanag/" + prod.id + "/0",
						headers: {
							Authorization: `Bearer ${this.token}`,
						},
					}).then(() => {
						prod.stock_manag = 0;
					});
				} else {
					if (prod.stock_manag === 0) {
						axios({
							method: "put",
							url:
								process.env.VUE_APP_API +
								"product/changestockmanag/" +
								prod.id +
								"/1",
							headers: {
								Authorization: `Bearer ${this.token}`,
							},
						}).then(() => {
							prod.stock_manag = 1;
						});
					}
				}
			}
		},

		//* Change status of stock_manag of the product (in creation of new product)
		createStockManag: function() {
			if (this.stock_man === 1) {
				this.stock_man = 0;
			} else {
				if (this.stock_man === 0) {
					this.stock_man = 1;
				}
			}
		},

		//* Go down to the bottom of the page
		downPage: function() {
			window.scrollTo(0, document.body.scrollHeight);
		},

		//* Display list of products according to the producer selected
		displayProdProdu: function() {
			this.$store.dispatch("checkConnect");
			if (!this.connected) {
				this.$router.push("/");
			} else {
				this.modifInProgress = false;
				if (this.produSelected != "") {
					this.products = [];
					axios({
						method: "get",
						url: process.env.VUE_APP_API + "product/producerid/" + this.produSelected,
					}).then((prod) => {
						this.length = prod.data.length;
						for (let i = 0; i < this.length; i++) {
							axios
								.get(
									process.env.VUE_APP_API +
										"producer/getproducer/" +
										this.produSelected
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
														unity: prod.data[i].unity,
														stock_manag: prod.data[i].stock_manag,
														stock_init: prod.data[i].stock_init,
														stock_updated: prod.data[i].stock_updated,
														stock_in_date: prod.data[i].stock_in_date,
														photo: prod.data[i].photo,
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
					});
				}
			}
		},

		//* Display list of ALL products
		selectAllProducts: function() {
			this.produSelected = "";
			location.reload();
		},
		//* Put all products actived
		putAllActived: function() {
			this.$store.dispatch("checkConnect");
			if (!this.connected) {
				this.$router.push("/");
			} else {
				axios({
					method: "put",
					url: process.env.VUE_APP_API + "product/putallproducts/actived",
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				}).then(() => {
					location.reload();
				});
			}
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
#title {
	display: flex;
	justify-content: space-around;
	margin-top: 0rem;
	margin-bottom: 1rem;
	margin-left: 5rem;
}

#selection {
	display: flex;
	width: 80%;
	justify-content: center;
	margin-bottom: 1rem;
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
	cursor: pointer;
}
.stock {
	width: 1.5rem;
	height: 1.5rem;
	margin-left: 0;
	cursor: pointer;
}
.on {
	background-color: greenyellow;
	color: black;
}
.off {
	background-color: red;
}
.on_stock {
	background-color: rgb(20, 243, 243);
}
.off_stock {
	background-color: rgb(224, 213, 213);
}

#allactived {
	margin-left: 5rem;
}
::v-deep(.p-dropdown) {
	background-color: #fbc02d;
}
#toBottom {
	margin-left: 5rem;
}
#selProd {
	background-color: #a3d7a5;
	margin-left: 2rem;
	margin-right: 0.3rem;
	width: 20rem;
	text-align: left;
}
#selAll {
	background-color: #a3d7a5;
	color: rgb(92, 91, 91);
}
</style>
