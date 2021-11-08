<template>
	<div>
		<h3>
			Commandes reçues pour livraison :<br />
			{{ deliveryDate }}
		</h3>
		<!-- Dropdown -->
		<div></div>
		<div>
			<button @click="displayByCustomer">Afficher par CLIENT</button>
			<button @click="displayByProduct">Afficher par PRODUIT</button>
		</div>
		<div v-if="client">
			<button @click="downloadClient">Télécharger Excel / CLIENT</button>
		</div>
		<div v-if="produit">
			<button @click="downloadProduit">Télécharger Excel / PRODUIT</button>
		</div>

		<!-- Tableau des commandes reçues -->
		<div>
			<!-- Table par client -->
			<table v-if="client">
				<caption>
					Commandes détaillées par client
				</caption>
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
					<td :class="pro.color">{{ pro.product }}</td>
					<td :class="pro.color">{{ pro.quantity }}</td>
					<td :class="pro.color">{{ pro.unity }}</td>
				</tr>
			</table>
		</div>
	</div>
</template>
<script>
import axios from "axios";
import moment from "moment";
import XlsExport from "xlsexport";
import { mapGetters } from "vuex";

export default {
	data() {
		return {
			products: [],
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
			linkOpenExcel: "",
			json: {
				dataSource: [{ name: "delphine", phone: "5555", email: "huh@ihji" }],
				head: ["name", "phone", "email"],
				fileName: "json.xlsx",
			},
			inQtyProd: false,
		};
	},
	beforeCreate: function() {
		this.orders = [];
	},
	created: function() {
		console.log("coucou");
		//* Display orders
		this.client = true;
		axios
			.get(process.env.VUE_APP_API + "order/getallorders/" + this.deliveryDate)
			.then((order) => {
				for (let i = 0; i < order.data.length; i++) {
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
										producerId: product.data.producerId,
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
								});
						});
				}
			})
			.catch((err) => {
				console.log(err);
			});
	},

	computed: {
		...mapGetters(["deliveryDate"]),
	},
	methods: {
		//* Format French date
		dateFr: function(date) {
			moment.locale("fr");
			return moment(date).format("DD/MM/YYYY");
		},

		//* Altern backcolor on lines in table for each customer
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
			this.qtyProd = [];
			this.produit = true;
			this.client = false;
			axios
				.get(process.env.VUE_APP_API + "order/getallorders/" + this.deliveryDate)
				.then((order) => {
					console.log(order.data.length);
					for (let i = 0; i < order.data.length; i++) {
						axios
							.get(
								process.env.VUE_APP_API + "product/datas/" + order.data[i].productId
							)
							.then((product) => {
								// Find name of product and unité_vente of productId
								axios
									.get(
										process.env.VUE_APP_API +
											"producer/getproducer/" +
											product.data.producerId
									)
									.then((producer) => {
										this.inQtyProd = false;
										for (let q = 0; q < this.qtyProd.length; q++) {
											if (product.data.product === this.qtyProd[q].product) {
												this.qtyProd[q].quantity =
													this.qtyProd[q].quantity +
													order.data[i].quantity;
												this.inQtyProd = true;
											}
										}
										if (!this.inQtyProd) {
											this.qtyProd.push({
												producer: producer.data.entreprise,
												product: product.data.product,
												quantity: order.data[i].quantity,
												unity: product.data.unite_vente,
												color: "line_pair",
											});
										}

										// sort alpha order
										this.qtyProd.sort(function(a, b) {
											var prodA = a.producer;
											var prodB = b.producer;

											if (prodA < prodB) {
												return -1;
											}
											if (prodA > prodB) {
												return 1;
											}
											return 0;
										});
										for (let j = 1; j < this.qtyProd.length; j = j + 2) {
											this.qtyProd[j].color = "line_impair";
										}
									});
							});
					}
				})
				.catch((err) => {
					console.log(err);
				});
			console.log(this.qtyProd);
		},

		//* Number format
		numFr: function(num) {
			return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
				num
			);
		},

		//* Downloading Excel By Customer
		downloadClient: function() {
			var xls = new XlsExport(this.orders, "Par_Client");
			xls.exportToXLS("commandes_Client_" + this.deliveryDate + ".xls");
		},
		// //* Downloading Excel By Product
		downloadProduit: function() {
			var xls = new XlsExport(this.qtyProd, "Par_Produit");
			xls.exportToXLS("commandes_Produit_" + this.deliveryDate + ".xls");
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
