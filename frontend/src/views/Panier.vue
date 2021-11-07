<template>
	<div>
		<!-- Table pour le panier de commande -->
		<div v-if="total === 0">
			<p>
				Votre panier est actuellement vide.
			</p>
		</div>
		<div id="commande" v-if="total > 0">
			<h5>Votre commande pour une livraison le {{ deliveryDate }}.</h5>

			<table>
				<caption>
					Votre commande
				</caption>
				<tr>
					<th>Produit</th>
					<th>Quantité</th>
					<th>Unité</th>
					<th>Prix/unité</th>
					<th>Prix</th>
					<th>Modification</th>
				</tr>
				<tr v-for="prod in products" :key="prod.id">
					<td v-if="prod.qty > 0">{{ prod.product }}</td>
					<td v-if="prod.qty > 0">{{ prod.qty }}</td>
					<td v-if="prod.qty > 0">{{ prod.unity }}</td>
					<td v-if="prod.qty > 0">{{ numFr(prod.price_unity) }}</td>
					<td v-if="prod.qty > 0">{{ numFr(prod.qty * prod.price_unity) }}</td>
					<td v-if="prod.qty > 0">- + supp</td>
				</tr>
				<!-- <td>Total = {{ total }}</td> -->
				<tr>
					<td colspan="4">
						Prix total de la commande :
					</td>
					<td id="total">{{ numFr(total) }}</td>
				</tr>
			</table>

			<button class="addsub" type="button" @click="validOrder">
				Valider la commande
			</button>
		</div>
	</div>
</template>
<script>
import axios from "axios";
import { mapState, mapGetters } from "vuex";

export default {
	data() {
		return {
			total: JSON.parse(localStorage.getItem("Total")),
			products: [],
			order: this.$store.state.order, //JSON.parse(localStorage.getItem("order")),
			dateId: 10,
		};
	},
	computed: {
		...mapGetters(["deliveryDate"]),
		...mapState(["order", "userId"]),
	},
	created: function() {
		console.log("hey !!");
		console.log(this.$store.state.userId);
		//*Select all products actived
		axios.get(process.env.VUE_APP_API + "product/actived").then((prod) => {
			// this.length = prod.data.length;
			for (let c = 0; c < prod.data.length; c++) {
				this.products.push({
					id: prod.data[c].id,
					product: prod.data[c].product,
					price_kg: prod.data[c].price_kg,
					unity: prod.data[c].unite_vente,
					price_unity: prod.data[c].price_unite_vente,
					qty: localStorage.getItem(prod.data[c].id),
				});
			}
		});
	},
	methods: {
		//* Number format
		numFr: function(num) {
			return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
				num
			);
		},

		//* Validation order
		validOrder: function() {
			console.log("valid");
			// console.log(this.products);
			console.log(this.dateId);
			console.log(this.products[0].product);
			axios.get(process.env.VUE_APP_API + "product/actived").then((prod) => {
				for (let i = 0; i < prod.data.length; i++) {
					if (this.products[i].qty > 0) {
						axios
							.post(
								process.env.VUE_APP_API +
									"order/createorder/" +
									this.$store.state.userId +
									"/" +
									this.dateId,
								{
									productId: this.products[i].id,
									quantity: this.products[i].qty,
									order_date: Date.now(),
								}
							)
							.then(() => {
								console.log("order saved !");
							})
							.catch((err) => {
								console.log(err);
							});
					}
				}
			});

			// axios({
			// 	method: "post",
			// 	url: process.env.VUE_APP_API + "order/createorder/" + 5 + "/" + 10,
			// 	data: {
			// 		productId: item.id,
			// 		quantity: item.qty,
			// 		order_date: Date.now(),
			// 	},
			// 	headers: {},
			// })
			// 	.then(() => {
			// 		console.log("order saved !");
			// 	})
			// 	.catch((err) => {
			// 		console.log(err);
			// 	});
			// this.manqProd = "";
			// for (let i = 0; i < this.length; i++) {
			// 	const decrem = parseInt(
			// 		this.displayProd[i].stock_updated - this.displayProd[i].qty
			// 	);
			// 	if (this.products[i].qty > 0) {
			// 		if (decrem < 0) {
			// 			this.manqProd =
			// 				"Manque des produits. Merci de baisser votre demande sur les produits suivants." +
			// 				this.manqProd +
			// 				" Stock =" +
			// 				this.products[i].stock_updated +
			// 				" pour les " +
			// 				this.products[i].product +
			// 				".";
			// 			this.infoOrder = this.manqProd;
			// 		}
			// 	}
			// }
			// this.tablMail = "";
			// for (let i = 0; i < this.length; i++) {
			// 	const decrem = parseInt(this.products[i].stock_updated - this.products[i].qty);
			// 	if (this.products[i].qty > 0) {
			// 		// si stock dispo
			// 		if (this.manqProd == "") {
			// 			// Si aucun manquant sinon user refait commande

			// 			this.tablMail =
			// 				this.tablMail +
			// 				"<tr><td style='border: 1px solid black;'>" +
			// 				this.products[i].product +
			// 				"<td style='border: 1px solid black;'>" +
			// 				this.products[i].qty +
			// 				"<td style='border: 1px solid black;'>" +
			// 				this.products[i].unite_vente +
			// 				"<td style='border: 1px solid black;'>" +
			// 				this.numFr(this.products[i].qty * this.products[i].price_unite_vente);
			// 			// Ajout données à la table Order
			// 			axios
			// 				.post(
			// 					process.env.VUE_APP_API +
			// 						"order/createorder/" +
			// 						this.userId +
			// 						"/" +
			// 						this.dateId,
			// 					{
			// 						productId: this.products[i].id,
			// 						quantity: this.products[i].qty,
			// 						order_date: Date.now(),
			// 					}
			// 				)
			// 				.then(() => {
			// 					//Décrémenter qté à la table Products
			// 					axios
			// 						.put(
			// 							process.env.VUE_APP_API +
			// 								"product/modif/" +
			// 								this.products[i].id,
			// 							{
			// 								stock_updated: decrem,
			// 							}
			// 						)
			// 						.then(() => {
			// 							console.log("order enregistrée dans base de données.");
			// 							//TODO Envoi de mail confirmation
			// 							if (this.manqProd == "") {
			// 								axios
			// 									.post(
			// 										process.env.VUE_APP_API +
			// 											"order/emailconf/" +
			// 											this.userId +
			// 											"/" +
			// 											this.dateId +
			// 											"/" +
			// 											this.tablMail +
			// 											"/" +
			// 											this.numFr(this.total)
			// 									)
			// 									.then(() => {
			// 										this.infoOrder =
			// 											"Votre commande a été enregistrée. Vous allez recevoir un email de confirmation.";
			// 									})
			// 									.catch((err) => {
			// 										this.infoOrder = err;
			// 										console.log(err);
			// 									});
			// 							}
			// 						})
			// 						.catch((err) => {
			// 							this.infoOrder = err;
			// 							console.log(err);
			// 						});
			// 				})
			// 				.catch((err) => {
			// 					this.infoOrder = err;
			// 					console.log(err);
			// 				});
			// 		}
			// 	}
			// }
		},
	},
};
</script>
<style scoped>
#commande {
	display: flex;
	flex-direction: column;
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
	margin: auto;
}
button {
	background-color: green;
	color: white;
	font-size: 16px;
	font-weight: bold;
	padding: 1px 6px 1px 6px;
	margin: auto;
}
#total {
	font-weight: bold;
}
</style>
