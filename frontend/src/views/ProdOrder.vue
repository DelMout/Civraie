<template>
	<div>
		<h4>
			<p>
				Prochaine livraison des commandes : <b> {{ deliveryDate }}</b>
			</p>
		</h4>
		<!-- A afficher si non connecté -->
		<!-- <h2>Pour pouvoir commander, vous devez vous connecter à votre compte</h2>-->

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

		<!-- Présentation produits sur petites cartes -->
		<!-- info producer when hover on product name -->
		<div id="conteneur" v-if="card_products">
			<div v-for="prod in displayProd" :key="prod.product">
				<div class="card_head" v-if="seeProducer">
					<p>
						{{ prod.producer }}<br />
						{{ prod.producer_address }}
					</p>
				</div>
				<div
					@mouseover="seeProducer = true"
					@mouseleave="seeProducer = false"
					class="card"
					:style="prod.selected"
				>
					<!-- <p id="faible" v-if="prod.alert <= 0 && prod.stock_updated > 0">
						Attention stock faible !
					</p> -->
					<!-- <p id="nulle" v-if="prod.stock_updated == 0">Plus de stock !</p> -->
					<p class="product">
						{{ prod.product }}
					</p>
					<!-- <p>{{ prod.producer }}</p> -->

					<img
						class="photo"
						v-if="prod.photo"
						style="width:100px;"
						:src="prod.photo"
						alt="product photo"
					/>

					<p>
						<span> {{ numFr(prod.price) }}/{{ prod.unite_vente }} </span>
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
			total: 0, // Qty of products in panier
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
			seeProducer: false,
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
		...mapMutations(["setProducts", "setTotal"]),
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
									producer_address: producer.data.address,
									cloturedayId: prod.data[i].cloturedayId,
									price: prod.data[i].price,
									unite_vente: prod.data[i].unite_vente,
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
			//! if logged null, alors message pour "se connecter pour commander"
			this.inOrder = false;
			if (localStorage === null) {
				localStorage.setItem("Total", 1);
				localStorage.setItem(prod.id, 1);
			} else {
				if (localStorage.getItem(prod.id) !== null) {
					localStorage.setItem(prod.id, JSON.parse(localStorage.getItem(prod.id)) + 1);
				} else {
					localStorage.setItem(prod.id, 1);
					localStorage.setItem("Total", JSON.parse(localStorage.getItem("Total")) + 1);
				}
			}
			this.$store.commit("setTotal", localStorage.getItem("Total"));

			prod.selected = "background-color:rgba(0,128,0,0.1);";
		},
		//* Substract product to the order
		subQty: function(event, prod) {
			console.log("g appuyé sur sub");
			if (localStorage.getItem(prod.id) !== null) {
				if (JSON.parse(localStorage.getItem(prod.id)) === 1) {
					localStorage.removeItem(prod.id);
					localStorage.setItem("Total", JSON.parse(localStorage.getItem("Total")) - 1);
					prod.selected = "";
				} else {
					console.log("je dois décrémenter !");
					localStorage.setItem(prod.id, JSON.parse(localStorage.getItem(prod.id)) - 1);
				}
			}
			this.$store.commit("setTotal", localStorage.getItem("Total"));
		},
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
.card_head {
	border: 3px solid rgba(255, 255, 255, 0.4);
	box-shadow: 5px 5px 5px grey;
	width: 10rem;
	height: 5rem;
	/* margin: 4px; */
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
