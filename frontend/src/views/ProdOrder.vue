<template>
	<div>
		<h4 v-if="categoryClass != 'escargot'">
			Prochaine livraison de commandes : <b> {{ deliveryDate }}</b>
		</h4>
		<h4 v-if="categoryClass == 'escargot'">
			Prochaine livraison de commandes :
			<b>
				<span id="deliveryNextWeek">{{ deliveryDateNextW }} </span> pour les escargots</b
			>
		</h4>

		<!-- Display categories products -->
		<div>
			<!-- V-for -->
			<div class="categories">
				<div v-for="cate in categories" :key="cate.id">
					<div :id="cate.class" class="category_card " @click="selectCat($event, cate)">
						<p>{{ cate.category }}</p>
					</div>
				</div>
				<!-- Livraison possible jusquau -->
			</div>
		</div>
		<div v-if="categorySel" class="categories" id="catePossible">
			<p
				id="possible"
				v-if="
					categoryClass != 'oeuf' &&
						categoryClass != 'huile' &&
						categoryClass != 'escargot'
				"
			>
				Commande possible de {{ categorySel }} jusqu'à
				<span>{{ cloture_day }}</span>
			</p>
			<p
				id="possible"
				v-if="
					categoryClass === 'oeuf' ||
						categoryClass === 'huile' ||
						categoryClass === 'escargot'
				"
			>
				Commande possible d'{{ categorySel }} jusqu'à
				<span>{{ cloture_day }}</span>
			</p>
		</div>

		<!-- Présentation produits sur petites cartes -->
		<!-- info producer when hover on product name -->
		<div id="conteneur" v-if="card_products">
			<div
				id="sousCont"
				v-for="prod in displayProd"
				:key="prod.product"
				:class="categoryClass"
			>
				<Card>
					<!-- <Card @mouseover="overlay"> -->
					<template #header>
						<img
							class="vignette"
							style="border-radius: 8px 8px 0 0"
							v-if="prod.photo"
							:src="prod.photo"
							alt="product photo"
						/>
						<img
							class="vignette"
							style="border-radius: 8px 8px 0 0"
							v-if="!prod.photo"
							src="../assets/legume2.jpg"
							alt="legumes"
						/>
					</template>
					<template #title>
						{{ prod.product }}
					</template>
					<template #content> {{ numFr(prod.price) }} / {{ prod.unite_vente }} </template>
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
		<div style="width:30vw">
			<Toast position="center" :breakpoints="{ '500px': { width: '90%' } }">
				<template #message="slotProps">
					<div class="p-d-flex ">
						<div class="p-text-center">
							<i class="pi pi-exclamation-triangle" style="font-size: 2rem"></i>
							<p class="p-text-center">{{ slotProps.message.detail }}</p>
						</div>
					</div>
				</template>
			</Toast>
		</div>
	</div>
</template>
<script>
import axios from "axios";
import { mapState, mapMutations, mapGetters } from "vuex";

export default {
	data() {
		return {
			displayProd: [],
			categories: [],
			length: "",
			card_products: false,
			categoryClass: "",
			categorySel: "",
			cloture_day: "", // cloture day of category selected
			noProduct: false,
			qtyDisplay: 0,
			counter: 0,
		};
	},
	computed: {
		...mapGetters(["deliveryDate", "deliveryDateNextW", "dayNow"]),
		...mapState(["products", "order", "total", "inPages", "connected", "newUser"]),
	},
	mounted: function() {
		if (this.$store.state.newUser) {
			this.$toast.add({
				severity: "success",
				detail: "Votre compte a été créé !",
				closable: false,
				life: 4000,
			});
		}
		this.$store.commit("setNewUserAnymore");
		this.$store.commit("setTotal", localStorage.getItem("Total")); // Pour mise à jour du panier
	},
	beforeCreate: function() {
		this.displayProd = [];
		this.categories = [];
	},
	created: function() {
		this.$store.state.inPages = true;

		//* All categories
		axios.get(process.env.VUE_APP_API + "category/getcategories").then((catego) => {
			for (let c = 0; c < catego.data.length; c++) {
				this.categories.push({
					id: catego.data[c].id,
					category: catego.data[c].category.toUpperCase(),
					class: catego.data[c].class,
					priority: catego.data[c].priority,
					cloture_day: catego.data[c].cloture_day,
				});
				// sort priority order
				this.categories.sort(function(a, b) {
					var prioA = a.priority;
					var prioB = b.priority;

					if (prioA < prioB) {
						return -1;
					}
					if (prioA > prioB) {
						return 1;
					}
					return 0;
				});
			}
		});
	},

	methods: {
		...mapMutations(["setProducts", "setTotal", "setNewUserAnymore"]),
		//* Number format
		numFr: function(num) {
			return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
				num
			);
		},
		//* Display products according to the category selected
		selectCat: function(event, cate) {
			this.counter++;
			this.displayProd = [];
			this.noProduct = false;
			this.card_products = true;
			this.cateSelected = cate.id;
			this.categorySel = cate.category;
			this.categoryClass = cate.class;
			this.cloture_day = cate.cloture_day;
			if (this.counter > 1) {
				if (document.getElementById("catePossible").classList.contains("catePossible")) {
					document.getElementById("catePossible").classList.remove("catePossible");
				}
			}

			axios
				.get(process.env.VUE_APP_API + "product/category/" + this.cateSelected)
				.then((prod) => {
					document.getElementById("catePossible").classList.add("catePossible");
					this.length = prod.data.length;
					for (let i = 0; i < this.length; i++) {
						axios
							.get(
								process.env.VUE_APP_API +
									"producer/getproducer/" +
									prod.data[i].producerId
							)
							.then((producer) => {
								if (localStorage.getItem(prod.data[i].id) !== null) {
									this.qtyDisplay = localStorage.getItem(prod.data[i].id);
								} else {
									this.qtyDisplay = 0;
								}
								this.displayProd.push({
									id: prod.data[i].id,
									product: prod.data[i].product,
									producerId: prod.data[i].producerId,
									producer: producer.data.entreprise,
									producer_address: producer.data.address,
									cloturedayId: prod.data[i].cloturedayId,
									price: prod.data[i].price,
									unite_vente: prod.data[i].unite_vente,
									photo: prod.data[i].photo,
									stock_manag: prod.data[i].stock_manag,
									stock_updated: prod.data[i].stock_updated,
									selected: this.beSelected,
									qty: this.qtyDisplay,
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

					if (this.length === 0) {
						this.noProduct = true;
					}
				});
		},

		//* Add product to the order
		addQty: function(event, prod) {
			if (this.$store.state.connected) {
				this.$store.dispatch("checkConnect");
				if (!this.connected) {
					this.$router.push("/");
				} else {
					if (localStorage === null) {
						localStorage.setItem("Total", 1);
						localStorage.setItem(prod.id, 1);
						prod.qty = 1;
						if (prod.producerId == process.env.VUE_APP_PRODUCER_ESCARG) {
							// If escargots selected
							localStorage.setItem("escarg", 1);
						} else {
							localStorage.setItem("other_escarg", 1);
						}
					} else {
						if (localStorage.getItem(prod.id) !== null) {
							// if product stock_managed
							if (
								(prod.stock_manag === 1 && prod.qty < prod.stock_updated) ||
								prod.stock_manag != 1 ||
								(prod.stock_manag === 1 && prod.stock_updated === null)
							) {
								localStorage.setItem(
									prod.id,
									JSON.parse(localStorage.getItem(prod.id)) + 1
								);
								prod.qty = localStorage.getItem(prod.id);
								if (prod.producerId == process.env.VUE_APP_PRODUCER_ESCARG) {
									localStorage.setItem(
										"escarg",
										JSON.parse(localStorage.getItem("escarg")) + 1
									);
								} else {
									localStorage.setItem(
										"other_escarg",
										JSON.parse(localStorage.getItem("other_escarg")) + 1
									);
								}
							} else {
								if (prod.stock_manag === 1 && prod.qty == prod.stock_updated) {
									this.$toast.add({
										severity: "error",
										detail: "Stock limité !",
										closable: false,
										life: 4000,
									});
								}
							}
						} else {
							localStorage.setItem(prod.id, 1);
							localStorage.setItem(
								"Total",
								JSON.parse(localStorage.getItem("Total")) + 1
							);
							prod.qty = 1;
							if (prod.producerId == process.env.VUE_APP_PRODUCER_ESCARG) {
								localStorage.setItem(
									"escarg",
									JSON.parse(localStorage.getItem("escarg")) + 1
								);
							} else {
								localStorage.setItem(
									"other_escarg",
									JSON.parse(localStorage.getItem("other_escarg")) + 1
								);
							}
						}
					}
					this.$store.commit("setTotal", localStorage.getItem("Total"));
				}
			} else {
				this.$toast.add({
					severity: "warn",
					detail: "Merci de vous connecter pour commander.",
					closable: false,
					life: 4000,
				});
			}
		},

		//* Substract product to the order
		subQty: function(event, prod) {
			this.$store.dispatch("checkConnect");
			if (!this.connected) {
				this.$router.push("/");
			} else {
				if (localStorage.getItem(prod.id) !== null) {
					if (JSON.parse(localStorage.getItem(prod.id)) === 1) {
						localStorage.removeItem(prod.id);
						localStorage.setItem(
							"Total",
							JSON.parse(localStorage.getItem("Total")) - 1
						);
						prod.qty = 0;
						// prod.selected = "";
						if (prod.producerId == process.env.VUE_APP_PRODUCER_ESCARG) {
							localStorage.setItem(
								"escarg",
								JSON.parse(localStorage.getItem("escarg")) - 1
							);
						} else {
							localStorage.setItem(
								"other_escarg",
								JSON.parse(localStorage.getItem("other_escarg")) - 1
							);
						}
					} else {
						localStorage.setItem(
							prod.id,
							JSON.parse(localStorage.getItem(prod.id)) - 1
						);
						prod.qty = localStorage.getItem(prod.id);
						if (prod.producerId == process.env.VUE_APP_PRODUCER_ESCARG) {
							localStorage.setItem(
								"escarg",
								JSON.parse(localStorage.getItem("escarg")) - 1
							);
						} else {
							localStorage.setItem(
								"other_escarg",
								JSON.parse(localStorage.getItem("other_escarg")) - 1
							);
						}
					}
				}
				this.$store.commit("setTotal", localStorage.getItem("Total"));
			}
		},
	},
};
</script>
<style scoped>
@keyframes alternate {
	0% {
		opacity: 0;
	}
	20% {
		opacity: 1;
	}
	100% {
		opacity: 0;
	}
}
@keyframes rotation {
	0% {
		transform: rotate(0deg);
	}
	25% {
		transform: rotate(2deg);
	}
	75% {
		transform: rotate(-2deg);
	}
	100% {
		transform: rotate(0deg);
	}
}
h4 {
	margin-top: 0;
}
#deliveryNextWeek {
	background-color: yellow;
	color: black;
	padding-left: 0.3rem;
	padding-right: 0.3rem;
	animation: 1s alternate 4 ease-in;
}

#conteneur {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	margin: auto;
	padding-right: auto;
	padding-left: auto;
	width: 80%;
}
#sousCont {
	width: 12rem;
	display: flex;
	justify-content: center;
	margin-bottom: 1rem;
}
.escargot {
	--height-card: 21rem;
	--height-title: 8rem;
}
.legume,
.lait,
.fruit,
.volaille,
.bovine,
.porcine,
.lapin,
.autruche,
.sucre,
.sale,
.oeuf,
.huile,
.boisson,
.garni,
.divers,
.sec,
.poisson,
.pate {
	--height-card: 17rem;
	--height-title: 4rem;
}
::v-deep(.p-card) {
	/* box-shadow: 5px 5px 5px white; */
	width: 10rem;
	margin: 0;
	padding: 0;
	height: var(--height-card);
	display: flex;
	flex-direction: column;
	border-radius: 8px;
}
::v-deep(.p-card .p-card-header) {
	height: 7rem;
}
.vignette {
	max-height: 100%;
	width: auto;
	max-width: 100%;
}
::v-deep(.p-card .p-card-title) {
	font-weight: bold;
	font-size: 1rem;
	width: 100%;
	margin: 0;
	height: var(--height-title);
	display: flex;
	justify-content: center;
	align-items: center;
}
::v-deep(.p-card .p-card-content) {
	height: 2rem;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 0.5rem;
}
::v-deep(.p-card .p-card-footer) {
	height: auto;
	display: flex;
	justify-content: center;
	margin-bottom: 0;
	padding-top: 0.7rem;
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
#possible {
	background-color: white;
	color: green;
	font-weight: bold;
	padding: 1rem 1rem 1rem 1rem;
	margin-bottom: 1rem;
	margin-top: 0.5rem;
	border-radius: 6px;
}

.catePossible {
	animation: 0.8s rotation 6 linear;
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
	padding: 0rem 0rem 0rem 0rem;
	margin: 0 1rem 1rem 1rem;
	border-radius: 10px;
	box-shadow: 3px 3px 0px #4a7d55;
	width: 8rem;
	height: 3.5rem;
	font-weight: bolder;
	color: #12511c;
	font-size: 1.2rem;
	font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
	cursor: pointer;
	background-color: white;
}

.category_card:hover {
	-webkit-transform: scale(1.25); /* Safari et Chrome */
	-moz-transform: scale(1.25); /* Firefox */
	-ms-transform: scale(1.25); /* Internet Explorer 9 */
	transform: scale(1.25);
	transition: transform ease-in-out;
}
.category_card p {
	margin: auto;
}
/* #fruit {
	background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.5)),
		url("../assets/pomme.jpg");
	background-size: 100%;
}
#legume {
	background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.5)),
		url("../assets/legume2.jpg");
	background-size: 100%;
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
#autruche {
	background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.5)),
		url("../assets/autruche.jpg");
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
		url("../assets/sale_facebook.jpg");
	background-size: 100%;
}
#pate {
	background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.5)),
		url("../assets/pasta.jpg");
	background-size: 100%;
}
#escargot {
	background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.5)),
		url("../assets/escargot_free.jpg");
	background-size: 100%;
}
#sec {
	background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.5)),
		url("../assets/chiche_free.jpg");
	background-size: 100%;
}
#poisson {
	background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.5)),
		url("../assets/fish_free.jpg");
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
} */

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
@media only screen and (max-width: 768px) {
	/*mobiles et tablettes*/
	.categories {
		width: 100%;
	}
	.category_card {
		width: 5rem;
		height: 2rem;
		font-size: 0.7rem;
		margin: 0 0.5rem 1rem 0.5rem;
	}
	#conteneur {
		width: 100%;
	}
	#sousCont {
		width: 9rem;
	}
	::v-deep(.p-card) {
		width: 8rem;
		height: 12.5rem;
	}

	::v-deep(.p-card .p-card-header) {
		height: 4rem;
	}
	::v-deep(.p-card .p-card-title) {
		font-size: 0.6rem;
		height: 3rem;
	}
	::v-deep(.p-card .p-card-content) {
		font-size: 0.6rem;
	}
	::v-deep(.p-card .p-card-footer) {
		height: auto;
		padding-top: 0.4rem;
		font-size: 0.8rem;
	}
	.addsub {
		margin: 0;
	}
	#qty {
		margin: 0px 6px 0px 6px;
	}
}
@media only screen and (max-width: 576px) {
	/*mobiles */
	#sousCont {
		width: 8rem;
	}
	::v-deep(.p-card) {
		width: 7rem;
		height: 12.5rem;
	}
	h4 {
		width: 90%;
		margin: auto;
		margin-bottom: 0.6rem;
		font-size: 0.8rem;
	}
}
</style>
