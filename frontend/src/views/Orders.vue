<template id="ordersTable">
	<div>
		<h3>
			Commandes reçues pour livraison :<br />
			{{ deliveryDate }}
		</h3>
		<!-- Dropdown -->
		<div></div>
		<div>
			<Button
				:label="custProd"
				class="p-button-rounded   p-button-warning p-button-sm"
				@click="display"
			/>
			<Button
				:label="download"
				style="color:black;margin-left:1rem"
				class="p-button-rounded   p-button-sm"
				@click="downloadX"
			/>
		</div>

		<!-- Tableau des commandes reçues -->
		<div id="tableau">
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
import { mapState, mapGetters, mapActions } from "vuex";

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
			inQtyProd: false,
			custProd: "Afficher par PRODUCTEUR",
			download: "Télécharger Excel par CLIENT",
		};
	},
	beforeMount: function() {
		this.$store.dispatch("checkConnect");
	},
	beforeCreate: function() {
		this.orders = [];
	},
	created: function() {
		//* Display orders
		this.client = true;
		this.$store.state.inPages = true;

		axios({
			method: "get",
			url: process.env.VUE_APP_API + "order/getallorders/" + this.deliveryDate,
			headers: {
				Authorization: `Bearer ${this.token}`,
			},
		})
			.then((order) => {
				for (let i = 0; i < order.data.length; i++) {
					axios({
						method: "get",
						url: process.env.VUE_APP_API + "user/getuser/" + order.data[i].userId,
						headers: {
							Authorization: `Bearer ${this.token}`,
						},
					}).then((user) => {
						// Find name of product and unité_vente of productId
						axios({
							method: "get",
							url:
								process.env.VUE_APP_API +
								"product/datas/" +
								order.data[i].productId,
							headers: {
								Authorization: `Bearer ${this.token}`,
							},
						}).then((product) => {
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
		...mapState(["inPages", "token"]),
	},
	methods: {
		...mapActions(["checkConnect"]),

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
		//* Choose display
		display: function() {
			if (this.custProd === "Afficher par PRODUCTEUR") {
				this.custProd = "Afficher par CLIENT";
				this.download = "Télécharger Excel par PRODUCTEUR";
				this.displayByProducer();
			} else {
				this.custProd = "Afficher par PRODUCTEUR";
				this.download = "Télécharger Excel par CLIENT";
				this.displayByCustomer();
			}
		},

		//* Display of orders by customer
		displayByCustomer: function() {
			this.produit = false;
			this.client = true;
			this.alterColor();
		},

		//* Display of orders by producer
		displayByProducer: function() {
			console.log("coucou");
			this.qtyProd = [];
			this.produit = true;
			this.client = false;
			axios({
				method: "get",
				url: process.env.VUE_APP_API + "order/getallorders/" + this.deliveryDate,
				headers: {
					Authorization: `Bearer ${this.token}`,
				},
			})
				.then((order) => {
					console.log(order.data.length);
					for (let i = 0; i < order.data.length; i++) {
						axios({
							method: "get",
							url:
								process.env.VUE_APP_API +
								"product/datas/" +
								order.data[i].productId,
							headers: {
								Authorization: `Bearer ${this.token}`,
							},
						}).then((product) => {
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
												this.qtyProd[q].quantity + order.data[i].quantity;
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
									let p = 0;
									for (let j = 1; j < this.qtyProd.length; j++) {
										if (
											this.qtyProd[j].producer != this.qtyProd[j - 1].producer
										) {
											p++;
											if (p % 2 == 0) {
												this.qtyProd[j].color = "line_pair";
											} else {
												this.qtyProd[j].color = "line_impair";
											}
										} else {
											this.qtyProd[j].color = this.qtyProd[j - 1].color;
										}
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
		//* Choose download
		downloadX: function() {
			if (this.download === "Télécharger Excel par PRODUCTEUR") {
				// this.download = "Télécharger Excel par CLIENT";
				this.downloadProduit();
			} else {
				// this.download = "Télécharger Excel par PRODUCTEUR";
				this.downloadClient();
			}
		},

		//* Downloading Excel By Customer
		downloadClient: function() {
			var xls = new XlsExport(this.orders, "Par_Client");
			xls.exportToXLS("commandes_Client_" + this.deliveryDate + ".xls");
		},
		// //* Downloading Excel By Product
		downloadProduit: function() {
			var xls = new XlsExport(this.qtyProd, "Par_Producteur");
			xls.exportToXLS("commandes_Producteur_" + this.deliveryDate + ".xls");
		},
	},
};
</script>
<style scoped>
#ordersTable {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
#tableau {
	margin: auto;
	width: 80%;
	margin-top: 1rem;
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
	margin: auto;
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
	color: black;
}
.line_impair {
	background-color: rgb(113, 155, 30);
	color: black;
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
table {
	margin-bottom: 2rem;
}
</style>
