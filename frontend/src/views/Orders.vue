<template>
	<div>
		<h1>Commandes envoyées par les utilisateurs</h1>
		<h3>
			Sélectionner la date de livraison des commandes
		</h3>
		<i>Les dates dans le passé proposées remontent seulement à 15 jours.</i>
		<!-- Dropdown -->
		<div>
			<button @click="select">Sélectionner la date de livraison</button>
			<p v-if="selected">Date de livraison sélectionnée : {{ selectedDate }}</p>
			<div v-for="sel in selectDate" :key="sel.id">
				<p class="dates" @click="dateSelected($event, sel)" v-if="displayList">
					{{ dateFr(sel.delivery_date) }}
				</p>
				<!-- <a v-if="displayList" :href="item.id">{{ item.delivery_date }}</a> -->
			</div>
			<p v-if="selected">Date au plus tard pour la saisie des commandes : {{ latestDate }}</p>
		</div>
		<div>
			<button @click="displayByCustomer">Afficher par CLIENT</button>
			<button @click="displayByProduct">Afficher par PRODUIT</button>
		</div>
		<!-- Tableau des commandes reçues -->
		<div>
			<i>Affichage par client (plusieurs petits tableaux) ou par produit</i>
			<!-- Table par client -->
			<table v-if="client">
				<caption>
					Commandes détaillées par client
				</caption>
				<!-- <tr>
						<th colspan="2">Client</th>
						<th>Date commande</th>
					</tr>
					<tr>
						<td colspan="2">{{ ord.userName }} {{ ord.userFirstName }}</td>
						<td>{{ dateFr(ord.order_date) }}</td>
					</tr> -->
				<tr>
					<th>Client</th>
					<th>Date commande</th>
					<th>Produits</th>
					<th>Quantité</th>
					<th>Unité</th>
				</tr>
				<tr v-for="ord in orders" :key="ord.userId">
					<td :class="ord.color">{{ ord.userName }} {{ ord.userFirstName }}</td>
					<td :class="ord.color">{{ dateFr(ord.order_date) }}</td>
					<td :class="ord.color">{{ ord.product }}</td>
					<td :class="ord.color">{{ ord.quantity }}</td>
					<td :class="ord.color">{{ ord.unite_vente }}</td>
				</tr>
			</table>

			<!-- Table par produit -->
			<table v-if="produit">
				<caption>
					Commandes totalisées par produit
				</caption>
				<tr>
					<th>Producteur</th>
					<th>Produit</th>
					<th>Quantité</th>
					<th>Unité</th>
				</tr>
				<tr v-for="pro in qtyProd" :key="pro.producer">
					<td :class="pro.color">{{ pro.producer }}</td>
					<td :class="pro.color">{{ pro.prod }}</td>
					<td :class="pro.color">{{ pro.qty }}</td>
					<td :class="pro.color">{{ pro.unite }}</td>
				</tr>
			</table>
		</div>
	</div>
</template>
<script>
import axios from "axios";
import moment from "moment";

export default {
	data() {
		return {
			products: [],
			selectDate: [],
			length: "",
			displayList: false,
			idDate: "",
			orders: [],
			qtyUsers: [],
			qtyProd: [],
			total: 0,
			dateId: 1, //TODO Aller chercher la bonne info
			userId: 5, //TODO Aller chercher la bonne info
			infoOrder: "",
			manqProd: "",
			tablMail: "",
			produit: false,
			client: false,
		};
	},
	beforeCreate: function() {
		this.selectDate = [];
		this.orders = [];
	},
	created: function() {
		this.selected = false;
		//* All delivery dates commencing by 2 weeks before today and so on
		axios.get(process.env.VUE_APP_API + "date/suggest").then((date) => {
			this.length = date.data.length;
			for (let i = 0; i < this.length; i++) {
				this.selectDate.push({
					id: date.data[i].id,
					delivery_date: date.data[i].delivery_date,
					latest_date: date.data[i].latest_date_order,
				});
				// sort alpha order
				this.selectDate.sort(function(a, b) {
					var dateA = a.delivery_date.toUpperCase();
					var dateB = b.delivery_date.toUpperCase();

					if (dateA < dateB) {
						return -1;
					}
					if (dateA > dateB) {
						return 1;
					}
					return 0;
				});
			}
		});
	},
	methods: {
		//* Format French date
		dateFr: function(date) {
			moment.locale("fr");
			return moment(date).format("DD/MM/YYYY");
		},

		//* Ask for displaying of delivery_date list
		select: function() {
			this.displayList = true;
			this.selected = false;
		},

		//*Display orders by customer
		dateSelected: function(event, item) {
			// listOrders: function(event, item) {
			this.orders = [];
			this.qtyUsers = [];
			this.qtyProd = [];
			this.displayList = false;
			this.selectedDate = this.dateFr(item.delivery_date);
			this.latestDate = this.dateFr(item.latest_date);
			this.idDate = item.id;
			this.selected = true;
			this.produit = false;
			this.client = false; // Display table of orders by customer
			// Build table Orders with dateId (from delivery date selected)
			axios.get(process.env.VUE_APP_API + "order/getorders/" + this.idDate).then((order) => {
				this.length = order.data.length;
				for (let i = 0; i < this.length; i++) {
					// Find name of userId
					axios
						.get(process.env.VUE_APP_API + "user/getuser/" + order.data[i].userId)
						.then((user) => {
							// Find name of product and unité_vente of productId
							axios
								.get(
									process.env.VUE_APP_API +
										"product/datas/" +
										order.data[i].productId
								)
								.then((product) => {
									this.orders.push({
										userId: order.data[i].userId,
										userName: user.data.nom.toUpperCase(),
										userFirstName: user.data.prenom,
										product: product.data.product,
										unite_vente: product.data.unite_vente,
										quantity: order.data[i].quantity,
										order_date: order.data[i].order_date,
										color: "line_pair",
									});
									// sort alpha order
									this.orders.sort(function(a, b) {
										var orderA = a.userId;
										var orderB = b.userId;

										if (orderA < orderB) {
											return -1;
										}
										if (orderA > orderB) {
											return 1;
										}
										return 0;
									});
									// List of userId
									if (this.qtyUsers.indexOf(order.data[i].userId) < 0) {
										this.qtyUsers.push(order.data[i].userId);
									}

									// sort alpha order
									this.qtyUsers.sort(function(a, b) {
										var userA = a;
										var userB = b;

										if (userA < userB) {
											return -1;
										}
										if (userA > userB) {
											return 1;
										}
										return 0;
									});

									//List of total by product
									axios
										.get(
											process.env.VUE_APP_API +
												"producer/getproducer/" +
												product.data.producerId
										)
										.then((producer) => {
											if (
												this.qtyProd.findIndex(
													(produ) => produ.prod === product.data.product
												) < 0
											) {
												this.qtyProd.push({
													prod: product.data.product,
													unite: product.data.unite_vente,
													qty: 0,
													producer: producer.data.entreprise,
													color: "line_pair",
												});

												console.log("qtyProd");
												console.log(this.qtyProd);
											}
										});
								});
						});
				}
			});
		},

		//* Altern backcolor on lines n table for each customer
		alterColor: function() {
			// //! Boucle sur nombre de qty Users et appliquer sur color !
			for (let j = 1; j < this.qtyUsers.length; j = j + 2) {
				console.log(this.orders);
				console.log(this.qtyUsers[j]);
				console.log("orders =");
				for (let k = 0; k < this.orders.length; k++) {
					console.log(this.orders[k].userId);
					if (this.orders[k].userId === this.qtyUsers[j]) {
						this.orders[k].color = "line_impair";
					}
				}
			}
		},

		//* Display of orders by customer
		displayByCustomer: function() {
			this.produit = false;
			this.client = true;
			this.alterColor();
		},

		//* Display of orders by product
		displayByProduct: function() {
			console.log("coucou");
			this.produit = true;
			this.client = false;
			console.log(this.qtyProd);

			this.qtyProd.forEach((qProd) => {
				let q = 0;
				this.orders.forEach((ord) => {
					if (qProd.prod === ord.product) {
						q = q + ord.quantity;
					}
				});
				console.log(qProd.prod + " = " + q);
				qProd.qty = q;
			});
			// Sort by producer
			this.qtyProd.sort(function(a, b) {
				var procerA = a.producer;
				var procerB = b.producer;

				if (procerA < procerB) {
					return -1;
				}
				if (procerA > procerB) {
					return 1;
				}
				return 0;
			});
			// Alternate color lines
			console.log("longur = " + this.qtyProd.length);
			for (let v = 1; v < this.qtyProd.length; v++) {
				if (this.qtyProd[v].producer != this.qtyProd[v - 1].producer) {
					if (this.qtyProd[v - 1].color === "line_pair") {
						this.qtyProd[v].color = "line_impair";
					} else {
						this.qtyProd[v].color = "line_pair";
					}
				} else {
					this.qtyProd[v].color = this.qtyProd[v - 1].color;
				}
			}

			console.log("resultat");
			console.log(this.qtyProd);
			// this.qtyProd.forEach((element) => console.log(element.prod));
			// sort alpha order
			// this.orders.sort(function(a, b) {
			// 	var orderA = a.product;
			// 	var orderB = b.product;

			// 	if (orderA < orderB) {
			// 		return -1;
			// 	}
			// 	if (orderA > orderB) {
			// 		return 1;
			// 	}
			// 	return 0;
			// });
		},

		//* Number format
		numFr: function(num) {
			return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
				num
			);
		},
		//* Add product to the order
		addQty: function(event, prod) {
			prod.qty += 1;
			this.total = this.total + JSON.parse(prod.price_unite_vente);
			console.log(this.total);
		},
		//* Substract product to the order
		subQty: function(event, prod) {
			prod.qty -= 1;
			this.total = this.total - JSON.parse(prod.price_unite_vente);
		},
		//* Validation order
		validOrder: function() {
			this.manqProd = "";
			for (let i = 0; i < this.length; i++) {
				const decrem = parseInt(this.products[i].stock_updated - this.products[i].qty);
				if (this.products[i].qty > 0) {
					if (decrem < 0) {
						this.manqProd =
							"Manque des produits. Merci de baisser votre demande sur les produits suivants." +
							this.manqProd +
							" Stock =" +
							this.products[i].stock_updated +
							" pour les " +
							this.products[i].product +
							".";
						this.infoOrder = this.manqProd;
					}
				}
			}
			this.tablMail = "";
			for (let i = 0; i < this.length; i++) {
				const decrem = parseInt(this.products[i].stock_updated - this.products[i].qty);
				if (this.products[i].qty > 0) {
					// si stock dispo
					if (this.manqProd == "") {
						// Si aucun manquant sinon user refait commande

						this.tablMail =
							this.tablMail +
							"<tr><td style='border: 1px solid black;'>" +
							this.products[i].product +
							"<td style='border: 1px solid black;'>" +
							this.products[i].qty +
							"<td style='border: 1px solid black;'>" +
							this.products[i].unite_vente +
							"<td style='border: 1px solid black;'>" +
							this.numFr(this.products[i].qty * this.products[i].price_unite_vente);
						// Ajout données à la table Order
						axios
							.post(
								process.env.VUE_APP_API +
									"order/createorder/" +
									this.userId +
									"/" +
									this.dateId,
								{
									productId: this.products[i].id,
									quantity: this.products[i].qty,
									order_date: Date.now(),
								}
							)
							.then(() => {
								//Décrémenter qté à la table Products
								axios
									.put(
										process.env.VUE_APP_API +
											"product/modif/" +
											this.products[i].id,
										{
											stock_updated: decrem,
										}
									)
									.then(() => {
										console.log("order enregistrée dans base de données.");
										//TODO Envoi de mail confirmation
										if (this.manqProd == "") {
											axios
												.post(
													process.env.VUE_APP_API +
														"order/emailconf/" +
														this.userId +
														"/" +
														this.dateId +
														"/" +
														this.tablMail +
														"/" +
														this.numFr(this.total)
												)
												.then(() => {
													this.infoOrder =
														"Votre commande a été enregistrée. Vous allez recevoir un email de confirmation.";
												})
												.catch((err) => {
													this.infoOrder = err;
													console.log(err);
												});
										}
									})
									.catch((err) => {
										this.infoOrder = err;
										console.log(err);
									});
							})
							.catch((err) => {
								this.infoOrder = err;
								console.log(err);
							});
					}
				}
			}
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
}
caption {
	background-color: green;
	color: white;
	font-weight: bolder;
	padding: 1rem 1rem 1rem 1rem;
}
th {
	background-color: green;
	color: white;
}
.line_pair {
	background-color: yellowgreen;
}
.line_impair {
	background-color: rgb(113, 155, 30);
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
#nulle {
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
.dates {
	cursor: pointer;
}
</style>
