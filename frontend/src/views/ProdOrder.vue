<template>
	<div>
		<h3>Produits vendus à la commande</h3>
		<p>
			Prochain livraison produits au magasin : <b> {{ deliveryDate }}</b>
		</p>
		<!-- A afficher si non connecté -->
		<!-- <h2>Pour pouvoir commander, vous devez vous connecter à votre compte</h2>
		<h3>
			Passer votre commande avant le {{ dateCommande }} soir. Livraison le {{ dateLivraison }}
		</h3> -->
		<p>{{ infoOrder }}</p>
		<!-- Display categories products -->
		<div>
			<!-- V-for -->

			<div class="categories">
				<div v-for="cate in categories" :key="cate.id">
					<div :id="cate.class" class="category_card " @click="selectCat($event, cate)">
						<p>{{ cate.category }}</p>
					</div>
				</div>
			</div>
		</div>
		<!-- Table pour le panier de commande -->
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
			<tr v-for="prod in displayProd" :key="prod.id">
				<td v-if="prod.qty > 0">{{ prod.product }}</td>
				<td v-if="prod.qty > 0">{{ prod.qty }} x</td>
				<td v-if="prod.qty > 0">{{ prod.unite_vente }}</td>
				<td v-if="prod.qty > 0">{{ numFr(prod.qty * prod.price_unite_vente) }}</td>
			</tr>

			<td colspan="4">
				Prix total de la commande : <span>{{ numFr(total) }} </span
				><button class="addsub" type="button" @click="validOrder">
					Valider la commande
				</button>
			</td>
		</table>

		<!-- Présentation produits sur petites cartes -->
		<div id="conteneur" v-if="card_products">
			<div v-for="prod in displayProd" :key="prod.product">
				<div class="card" :style="prod.selected">
					<!-- <p id="faible" v-if="prod.alert <= 0 && prod.stock_updated > 0">
						Attention stock faible !
					</p> -->
					<!-- <p id="nulle" v-if="prod.stock_updated == 0">Plus de stock !</p> -->
					<p class="product">{{ prod.product }}</p>
					<!-- <p>{{ prod.producer }}</p> -->

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
					<p>
						<!-- {{ prod.cloturedayId }} -->
						{{ cloturedays[prod.cloturedayId].cloture_day }}
					</p>
					<!-- <p>Quantité mini :<br />{{ prod.unite_vente }}</p> -->
					<p id="butAddSub">
						<button class="addsub" type="button" @click="subQty($event, prod)">
							-
						</button>

						<button class="addsub" type="button" @click="addQty($event, prod)">
							+
						</button>
					</p>
				</div>
			</div>

			<p v-if="noProduct">Pas de produits en vente actuellement dans cette catégorie.</p>
		</div>

		<p>Nombre produits = {{ length }}</p>
	</div>
</template>
<script>
import axios from "axios";
import { mapState, mapMutations, mapGetters } from "vuex";

export default {
	data() {
		return {
			dateCommande: "25/08/2021",
			dateLivraison: "30/08/2021",
			products: [],
			displayProd: [],
			categories: [],
			length: "",
			order: [],
			cloturedays: [
				{ id: 0, cloture_day: "Dimanche" },
				{ id: 1, cloture_day: "Lundi" },
				{ id: 2, cloture_day: "Mardi" },
				{ id: 3, cloture_day: "Mercredi" },
				{ id: 4, cloture_day: "Jeudi" },
				{ id: 5, cloture_day: "Vendredi" },
				{ id: 6, cloture_day: "Samedi" },
			],
			total: 0,
			dateId: 10, //TODO Aller chercher la bonne info
			userId: 7, //TODO Aller chercher la bonne info
			infoOrder: "",
			manqProd: "",
			tablMail: "",
			card_products: false,
			cateSelected: "",
			noProduct: false,
			style: "",
			inOrder: false,
			beSelected: "",
		};
	},
	computed: {
		...mapGetters(["deliveryDate", "dayNow"]),
		...mapState(["products", "order", "total"]),
	},
	beforeCreate: function() {
		this.products = [];
		this.displayProd = [];
		this.categories = [];
	},
	created: function() {
		// Check if product is not evalable for saling according cloture_day
		let now = this.$store.getters.dayNow;
		console.log("now = " + now);
		this.$store.commit("setProducts", this.products);
		console.log(this.$store.state.products);

		//* All categories
		axios.get(process.env.VUE_APP_API + "category/getcategories").then((catego) => {
			for (let c = 0; c < catego.data.length; c++) {
				this.categories.push({
					id: catego.data[c].id,
					category: catego.data[c].category.toUpperCase(),
					class: catego.data[c].class,
				});
			}
		});
	},

	methods: {
		// ...mapActions(["nextDeliveryDay"]),
		...mapMutations(["setProducts"]),
		//* Number format
		numFr: function(num) {
			return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
				num
			);
		},
		//* Display products according to the category selected
		selectCat: function(event, cate) {
			this.displayProd = [];
			this.noProduct = false;
			this.card_products = true;
			console.log(cate.id);
			this.cateSelected = cate.id;

			axios
				.get(process.env.VUE_APP_API + "product/category/" + this.cateSelected)
				.then((prod) => {
					this.length = prod.data.length;
					for (let i = 0; i < this.length; i++) {
						axios
							.get(
								process.env.VUE_APP_API +
									"producer/getproducer/" +
									prod.data[i].producerId
							)
							.then((producer) => {
								//color background if in panier
								if (localStorage.getItem(prod.data[i].id) !== null) {
									this.beSelected = "background-color:rgba(0,128,0,0.1);";
								} else {
									this.beSelected = "";
								}
								this.displayProd.push({
									id: prod.data[i].id,
									product: prod.data[i].product,
									producer: producer.data.entreprise,
									cloturedayId: prod.data[i].cloturedayId,
									price_kg: prod.data[i].price_kg,
									unite_vente: prod.data[i].unite_vente,
									price_unite_vente: prod.data[i].price_unite_vente,
									photo: prod.data[i].photo,
									alert: prod.data[i].stock_updated - prod.data[i].alert_stock,
									stock_updated: prod.data[i].stock_updated,
									selected: this.beSelected,
									qty: 0,
								});
								// sort alpha order
								this.displayProd.sort(function(a, b) {
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
					console.log(this.displayProd);
					console.log("blavla");
					// this.$store.commit("setProducts", this.products);
					// console.log(this.$store.state.products);
					if (this.length === 0) {
						this.noProduct = true;
					}
				});
		},

		//* Add product to the order
		addQty: function(event, prod) {
			this.inOrder = false;
			// prod.qty += 1;
			if (localStorage === null) {
				// If order empty
				// this.$store.state.total = 0;
				localStorage.setItem("Total", 0);
				// this.$store.state.order.push({
				// 	productId: prod.id,
				// 	product: prod.product,
				// 	quantity: 1,
				// 	unity: prod.unite_vente,
				// 	price_unity: prod.price_unite_vente,
				// });
				localStorage.setItem(prod.id, 1);
			} else {
				// for (let m = 0; m < this.$store.state.order.length; m++) {
				// 	if (this.$store.state.order[m].productId === prod.id) {
				// 		this.$store.state.order[m].quantity += 1;
				// 		localStorage.setItem(
				// 			prod.id,
				// 			JSON.parse(localStorage.getItem(prod.id)) + 1
				// 		);
				// 		this.inOrder = true;
				// 	}
				// }
				if (localStorage.getItem(prod.id) !== null) {
					localStorage.setItem(prod.id, JSON.parse(localStorage.getItem(prod.id)) + 1);
				} else {
					localStorage.setItem(prod.id, 1);
				}

				// if (!this.inOrder) {
				// 	this.$store.state.order.push({
				// 		productId: prod.id,
				// 		product: prod.product,
				// 		quantity: 1,
				// 		unity: prod.unite_vente,
				// 		price_unity: prod.price_unite_vente,
				// 	});

				// }
			}
			// this.$store.state.total = this.$store.state.total + JSON.parse(prod.price_unite_vente);
			localStorage.setItem(
				"Total",
				JSON.parse(localStorage.getItem("Total")) + JSON.parse(prod.price_unite_vente)
			);
			// console.log(this.$store.state.total);
			// console.log(this.$store.state.order.length);
			// console.log(this.$store.state.order);
			prod.selected = "background-color:rgba(0,128,0,0.1);";
		},
		//* Substract product to the order
		subQty: function(event, prod) {
			console.log("g appuyé sur sub");
			//! Mettre à zéro localStorage lors de la connection du user.
			if (localStorage.getItem(prod.id) !== null) {
				if (JSON.parse(localStorage.getItem(prod.id)) === 1) {
					localStorage.removeItem(prod.id);
					localStorage.setItem(
						"Total",
						JSON.parse(localStorage.getItem("Total")) -
							JSON.parse(prod.price_unite_vente)
					);
					prod.selected = "";
				} else {
					console.log("je dois décrémenter !");
					localStorage.setItem(prod.id, JSON.parse(localStorage.getItem(prod.id)) - 1);
					localStorage.setItem(
						"Total",
						JSON.parse(localStorage.getItem("Total")) -
							JSON.parse(prod.price_unite_vente)
					);
				}
			}

			// for (let m = 0; m < this.$store.state.order.length; m++) {
			// 	if (this.$store.state.order[m].productId === prod.id) {
			// 		if (this.$store.state.order[m].quantity === 1) {
			// 			//delete this product in this.order
			// 			this.$store.state.order.splice(m, 1);
			// 			// prod.selected = "";
			// 			localStorage.removeItem(prod.id);
			// 			localStorage.setItem(
			// 				"Total",
			// 				localStorage.getItem("Total") - JSON.parse(prod.price_unite_vente)
			// 			);
			// 		} else {
			// 			this.$store.state.order[m].quantity -= 1;
			// 			localStorage.setItem(
			// 				prod.id,
			// 				JSON.parse(localStorage.getItem(prod.id)) - 1
			// 			);
			// 			localStorage.setItem(
			// 				"Total",
			// 				localStorage.getItem("Total") - JSON.parse(prod.price_unite_vente)
			// 			);
			// 		}
			// 	}
			// }

			// if (prod.qty < 1) {
			// 	prod.selected = "";
			// }

			// console.log(this.$store.state.order);
			// console.log(this.$store.state.total);
		},
		//* Validation order
		// validOrder: function() {
		// 	this.manqProd = "";
		// 	for (let i = 0; i < this.length; i++) {
		// 		const decrem = parseInt(this.displayProd[i].stock_updated - this.displayProd[i].qty);
		// 		if (this.products[i].qty > 0) {
		// 			if (decrem < 0) {
		// 				this.manqProd =
		// 					"Manque des produits. Merci de baisser votre demande sur les produits suivants." +
		// 					this.manqProd +
		// 					" Stock =" +
		// 					this.products[i].stock_updated +
		// 					" pour les " +
		// 					this.products[i].product +
		// 					".";
		// 				this.infoOrder = this.manqProd;
		// 			}
		// 		}
		// 	}
		// 	this.tablMail = "";
		// 	for (let i = 0; i < this.length; i++) {
		// 		const decrem = parseInt(this.products[i].stock_updated - this.products[i].qty);
		// 		if (this.products[i].qty > 0) {
		// 			// si stock dispo
		// 			if (this.manqProd == "") {
		// 				// Si aucun manquant sinon user refait commande

		// 				this.tablMail =
		// 					this.tablMail +
		// 					"<tr><td style='border: 1px solid black;'>" +
		// 					this.products[i].product +
		// 					"<td style='border: 1px solid black;'>" +
		// 					this.products[i].qty +
		// 					"<td style='border: 1px solid black;'>" +
		// 					this.products[i].unite_vente +
		// 					"<td style='border: 1px solid black;'>" +
		// 					this.numFr(this.products[i].qty * this.products[i].price_unite_vente);
		// 				// Ajout données à la table Order
		// 				axios
		// 					.post(
		// 						process.env.VUE_APP_API +
		// 							"order/createorder/" +
		// 							this.userId +
		// 							"/" +
		// 							this.dateId,
		// 						{
		// 							productId: this.products[i].id,
		// 							quantity: this.products[i].qty,
		// 							order_date: Date.now(),
		// 						}
		// 					)
		// 					.then(() => {
		// 						//Décrémenter qté à la table Products
		// 						axios
		// 							.put(
		// 								process.env.VUE_APP_API +
		// 									"product/modif/" +
		// 									this.products[i].id,
		// 								{
		// 									stock_updated: decrem,
		// 								}
		// 							)
		// 							.then(() => {
		// 								console.log("order enregistrée dans base de données.");
		// 								//TODO Envoi de mail confirmation
		// 								if (this.manqProd == "") {
		// 									axios
		// 										.post(
		// 											process.env.VUE_APP_API +
		// 												"order/emailconf/" +
		// 												this.userId +
		// 												"/" +
		// 												this.dateId +
		// 												"/" +
		// 												this.tablMail +
		// 												"/" +
		// 												this.numFr(this.total)
		// 										)
		// 										.then(() => {
		// 											this.infoOrder =
		// 												"Votre commande a été enregistrée. Vous allez recevoir un email de confirmation.";
		// 										})
		// 										.catch((err) => {
		// 											this.infoOrder = err;
		// 											console.log(err);
		// 										});
		// 								}
		// 							})
		// 							.catch((err) => {
		// 								this.infoOrder = err;
		// 								console.log(err);
		// 							});
		// 					})
		// 					.catch((err) => {
		// 						this.infoOrder = err;
		// 						console.log(err);
		// 					});
		// 			}
		// 		}
		// 	}
		// },
	},
};
</script>
<style scoped>
h3 {
	margin-top: 0;
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
}

#conteneur {
	display: flex;
	/* justify-content: center; */
	flex-wrap: wrap;
	/* align-content: space-between; */
	align-content: flex-start;
	margin: auto;
	padding-right: auto;
	padding-left: auto;
	width: 107rem;
}
.card {
	border: 3px solid green;
	box-shadow: 5px 5px 5px grey;
	width: 10rem;
	height: 15rem;
	margin: 4px;
	display: flex;
	flex-direction: column;
}
.product {
	font-weight: bold;
	font-size: 0.8rem;
	margin-bottom: 0;
}
/* #nulle {
	background-color: red;
	color: white;
	padding-top: 2px;
	padding-bottom: 2px;
	margin-top: 0;
	margin-bottom: 0;
}
#faible {
	background-color: orange;
	color: black;
	padding-top: 2px;
	padding-bottom: 2px;
	margin-top: 0;
	margin-bottom: 0;
} */
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
.categories {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	align-content: space-between;
	width: 82rem;
	margin: auto;
}

.category_card {
	display: flex;
	padding: 0rem 0.9rem 0rem 0.9rem;
	margin: 0 1rem 1rem 1rem;
	/* border: 3px solid green; */
	border-radius: 10px;
	box-shadow: 5px 5px 5px rgb(85, 85, 85);
	width: 6.5rem;
	height: 3.5rem;
	font-weight: bolder;

	color: rgb(85, 85, 85);
	/* color: rgb(85, 85, 85); */
	font-size: 1.2rem;
	/* -webkit-text-stroke: 1.5px white; */
	/* text-shadow: 2px 2px 2px rgb(4, 88, 4); */
	text-shadow: 2px 3px 3px white;
	font-family: Tahoma, sans-serif;
	cursor: pointer;
}

.category_card:hover {
	-webkit-transform: scale(1.25); /* Safari et Chrome */
	-moz-transform: scale(1.25); /* Firefox */
	-ms-transform: scale(1.25); /* Internet Explorer 9 */
	transform: scale(1.25);
	transition: transform ease-in;
}
.category_card p {
	margin: auto;
}
#fruit {
	background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.6)),
		url("../assets/pomme.jpg");
	background-size: 100%;
}
#legume {
	background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.6)),
		url("../assets/legume2.jpg");
	background-size: 100%;
	/* border: 4px solid rgb(85, 85, 85); */
}
#lapin {
	background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.6)),
		url("../assets/lapin.jpg");
	background-size: 100%;
}
#oeuf {
	background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.6)),
		url("../assets/oeufs2.jpg");
	background-size: 100%;
}
#lait {
	background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.6)),
		url("../assets/fromage1.jpg");
	background-size: 100%;
}
#volaille {
	background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.6)),
		url("../assets/poules.jpg");
	background-size: 100%;
}
#bovine {
	background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.6)),
		url("../assets/vache.jpg");
	background-size: 100%;
}
#porcine {
	background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.6)),
		url("../assets/cochons.jpg");
	background-size: 100%;
}
#sucre {
	background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.6)),
		url("../assets/confit.jpg");
	background-size: 100%;
}
#sale {
	background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.6)),
		url("../assets/pasta.jpg");
	background-size: 100%;
}
#huile {
	background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.6)),
		url("../assets/huile.jpg");
	background-size: 100%;
}
#boisson {
	background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.6)),
		url("../assets/vins.jpg");
	background-size: 100%;
}
#garni {
	background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.6)),
		url("../assets/panier_garni.jpg");
	background-size: 120%;
}
#divers {
	background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.7)),
		url("../assets/rayon_magasin.jpg");
	background-size: 100%;
}

/* MEDIA QUERIES */
@media only screen and (max-width: 1500px) {
	.category_card {
		width: 5rem;
		height: 2.5rem;
		font-size: 0.9rem;
	}
	.categories {
		width: 70rem;
	}
	#conteneur {
		width: 81rem;
	}
}
</style>
