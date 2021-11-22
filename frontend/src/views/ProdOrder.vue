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
			<div id="sousCont" v-for="prod in displayProd" :key="prod.product">
				<OverlayPanel ref="op" class="overlay" style="textAlign:center;borderRadius:8px">
					<i>
						<u>Producteur</u> :<br />
						{{ prod.producer }}<br />
						{{ prod.producer_address }}
					</i>
				</OverlayPanel>
				<Card @mouseover="overlay">
					<template #header>
						<img
							id="vignette"
							style="border-radius: 8px 8px 0 0"
							v-if="prod.photo"
							:src="prod.photo"
							alt="product photo"
						/>
					</template>
					<template #title>
						{{ prod.product }}
					</template>
					<template #content> {{ numFr(prod.price) }}/{{ prod.unite_vente }} </template>
					<template #footer>
						<p id="butAddSub">
							<Button
								label="-"
								class="addsub sub p-button-raised p-button-danger"
								@click="subQty($event, prod)"
							/>
							<span id="qty">{{ prod.qty }}</span>

							<Button
								label="+"
								class="addsub p-button-raised p-button-success"
								@click="addQty($event, prod)"
							/>
						</p>
					</template>
				</Card>
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
		...mapState(["products", "order", "total", "inPages"]),
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
		this.$store.state.inPages = true;

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
				prod.qty = 1;
			} else {
				if (localStorage.getItem(prod.id) !== null) {
					localStorage.setItem(prod.id, JSON.parse(localStorage.getItem(prod.id)) + 1);
					prod.qty = localStorage.getItem(prod.id);
				} else {
					localStorage.setItem(prod.id, 1);
					localStorage.setItem("Total", JSON.parse(localStorage.getItem("Total")) + 1);
					prod.qty = 1;
				}
			}
			this.$store.commit("setTotal", localStorage.getItem("Total"));

			// prod.selected = "background-color:rgba(0,128,0,0.1);";
		},
		//* Substract product to the order
		subQty: function(event, prod) {
			console.log("g appuyé sur sub");
			if (localStorage.getItem(prod.id) !== null) {
				if (JSON.parse(localStorage.getItem(prod.id)) === 1) {
					localStorage.removeItem(prod.id);
					localStorage.setItem("Total", JSON.parse(localStorage.getItem("Total")) - 1);
					prod.qty = 0;
					// prod.selected = "";
				} else {
					console.log("je dois décrémenter !");
					localStorage.setItem(prod.id, JSON.parse(localStorage.getItem(prod.id)) - 1);
					prod.qty = localStorage.getItem(prod.id);
				}
			}
			this.$store.commit("setTotal", localStorage.getItem("Total"));
		},
		//* Display producer of product
		overlay(event) {
			this.$refs.op.toggle(event);
		},
	},
};
</script>
<style scoped>
h3 {
	margin-top: 0;
}

#conteneur {
	display: flex;
	justify-content: center;
	/* flex-wrap: wrap; */
	/* align-content: space-between; */
	/* align-content: flex-start; */
	margin: auto;
	padding-right: auto;
	padding-left: auto;
	width: 80%;
}
#sousCont {
	width: 15%;
	display: flex;
	justify-content: center;
	/* flex-wrap: wrap; */
	/* align-content: space-between; */
	/* background-color: greenyellow; */
}
::v-deep(.p-card) {
	/* border: 2px solid #125e1c; */
	box-shadow: 5px 5px 5px white;
	width: 10rem;
	margin: 0;
	/* margin: 4px; */
	padding: 0;
	height: 17rem;
	display: flex;
	flex-direction: column;
	border-radius: 8px;
}
::v-deep(.p-card .p-card-header) {
	/* width: 100%; */
	height: 40%;
	margin: 0;
}
#vignette {
	max-height: 100%;
	width: auto;
}
::v-deep(.p-card .p-card-title) {
	font-weight: bold;
	font-size: 1rem;
	width: 100%;
	margin: 0;
	height: 4rem;
	display: flex;
	justify-content: center;
	align-items: center;
}
::v-deep(.p-card .p-card-content) {
	height: 2rem;
	display: flex;
	justify-content: center;
	align-items: center;
}
::v-deep(.p-card .p-card-footer) {
	height: auto;
	display: flex;
	justify-content: center;
	margin-bottom: 0;
	/* align-items: flex-end; */
}

img {
	margin: 0;
}
.addsub {
	font-weight: 800;
	padding: 0 3px 5px 3px;
	line-height: 10px;
	font-size: 20px;
	margin-inline: 10px;
}
.sub {
	padding: 0px 5px 5px 5px;
}
#butAddSub {
	margin-top: 0;
}
.categories {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	align-content: space-between;
	width: 70rem;
	margin: auto;
}

.category_card {
	display: flex;
	padding: 0rem 0.9rem 0rem 0.9rem;
	margin: 0 1rem 1rem 1rem;
	border-radius: 10px;
	box-shadow: 5px 5px 5px white;
	width: 8rem;
	height: 3.5rem;
	font-weight: bolder;
	color: #12511c;
	font-size: 1.2rem;
	/* text-shadow: 2px 3px 3px white; */
	font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
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
	text-shadow: 0 0 10px #ffffff, 0 0 20px #ffffff, 0 0 40px #ffffff, 0 0 80px #ffffff,
		0 0 160px #ffffff;
}
#fruit {
	background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.5)),
		url("../assets/pomme.jpg");
	background-size: 100%;
}
#legume {
	background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.5)),
		url("../assets/legume2.jpg");
	background-size: 100%;
	/* border: 4px solid rgb(85, 85, 85); */
}
#lapin {
	background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.5)),
		url("../assets/lapin.jpg");
	background-size: 100%;
}
#oeuf {
	background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.5)),
		url("../assets/oeufs2.jpg");
	background-size: 100%;
}
#lait {
	background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.5)),
		url("../assets/fromage1.jpg");
	background-size: 100%;
}
#volaille {
	background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.5)),
		url("../assets/poules.jpg");
	background-size: 100%;
}
#bovine {
	background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.5)),
		url("../assets/vache.jpg");
	background-size: 100%;
}
#porcine {
	background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.5)),
		url("../assets/cochons.jpg");
	background-size: 100%;
}
#sucre {
	background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.5)),
		url("../assets/confit.jpg");
	background-size: 100%;
}
#sale {
	background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.5)),
		url("../assets/pasta.jpg");
	background-size: 100%;
}
#huile {
	background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.5)),
		url("../assets/huile.jpg");
	background-size: 100%;
}
#boisson {
	background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.5)),
		url("../assets/vins.jpg");
	background-size: 100%;
}
#garni {
	background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.5)),
		url("../assets/panier_garni.jpg");
	background-size: 120%;
}
#divers {
	background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.5)),
		url("../assets/rayon_magasin.jpg");
	background-size: 100%;
}

/* MEDIA QUERIES */
@media only screen and (max-width: 1500px) {
	.category_card {
		width: 6.5rem;
		height: 2.8rem;
		font-size: 0.9rem;
	}
	.categories {
		width: 70%;
	}
	#conteneur {
		width: 80%;
	}
}
</style>
