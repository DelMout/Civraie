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
			<button @click="displayOrder">Afficher par</button>
		</div>
		<!-- Tableau des commandes reçues -->
		<div>
			<i>Affichage par client (plusieurs petits tableaux) ou par produit</i>
			<!-- Table par client -->
			<table>
				<caption>
					Commandes détaillées par client
				</caption>
				<tr>
					<th colspan="3">Client n°3</th>
				</tr>
				<tr>
					<th>Produits</th>
					<th>Quantité</th>
					<th>Unité</th>
				</tr>
			</table>

			<!-- Table par produit -->
			<table>
				<caption>
					Commandes totalisées par produit
				</caption>
				<tr>
					<th>Produits</th>
					<th>Quantité</th>
					<th>Unité</th>
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
			bought: [],
			total: 0,
			dateId: 1, //TODO Aller chercher la bonne info
			userId: 5, //TODO Aller chercher la bonne info
			infoOrder: "",
			manqProd: "",
			tablMail: "",
		};
	},
	beforeCreate: function() {
		this.selectDate = [];
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
			console.log(this.selectDate);
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

		//* When delivery_date selected
		dateSelected: function(event, item) {
			this.displayList = false;
			this.selectedDate = this.dateFr(item.delivery_date);
			this.latestDate = this.dateFr(item.latest_date);
			this.idDate = item.id;
			this.selected = true;
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
	background-color: greenyellow;
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
