<template>
	<div>
		<!-- Table pour le panier de commande -->
		<div v-if="total === null || total == 0">
			<p>
				{{ info }}
			</p>
		</div>

		<div id="commande" v-if="total > 0">
			<h5>Votre commande sera livrée le {{ deliveryDate }}.</h5>

			<table>
				<caption>
					Votre commande
				</caption>
				<tr>
					<th>Produit</th>
					<th>Quantité</th>
					<th>Unité</th>
					<!-- <th>Prix/unité</th>
					<th>Prix</th> -->
					<th>Modification</th>
				</tr>
				<tr v-for="prod in products" :key="prod.id">
					<td v-if="prod.qty > 0">{{ prod.product }}</td>
					<td v-if="prod.qty > 0">{{ prod.qty }}</td>
					<td v-if="prod.qty > 0">{{ prod.unity }}</td>
					<td v-if="prod.qty > 0">
						<p id="butAddSub">
							<Button
								label="-"
								class="addsub sub p-button-raised p-button-danger"
								@click="subQty($event, prod)"
							/>

							<Button
								label="+"
								class="addsub p-button-raised p-button-success"
								@click="addQty($event, prod)"
							/>
						</p>
					</td>
				</tr>
			</table>

			<div v-if="!ordered">
				<Button
					label="Valider la commande"
					class=" p-button-raised p-button-primary valid"
					@click="validOrder"
				/>
			</div>
			<div v-if="ordered">
				<ProgressSpinner />
			</div>
		</div>
		<div>
			<Dialog
				header="Confirmation"
				v-model:visible="dialog"
				:breakpoints="{ '960px': '75vw', '640px': '100vw' }"
				:style="{ width: '20vw' }"
				><p>
					Votre commande a été enregistrée. Vous allez recevoir un email de confirmation.
				</p>
				<template #footer>
					<Button label="OK" @click="closeConfirm" autofocus />
				</template>
			</Dialog>
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
			tablMail: "",
			info: "Votre panier est actuellement vide.",
			dialog: false,
			ordered: false,
		};
	},
	computed: {
		...mapGetters(["deliveryDate"]),
		...mapState(["order", "userId", "connected", "inPages", "token"]),
	},
	created: function() {
		this.$store.dispatch("checkConnect");
		this.$store.state.inPages = true;
		console.log("hey !!");
		console.log(this.$store.state.userId);
		//*Select all products actived
		axios({
			method: "get",
			url: process.env.VUE_APP_API + "product/getproducts/actived",
			headers: {
				Authorization: `Bearer ${this.token}`,
			},
		}).then((prod) => {
			console.log(prod);
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
			console.log(this.products);
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
			this.ordered = true;
			// Save in database
			axios({
				method: "get",
				url: process.env.VUE_APP_API + "product/getproducts/actived",
			}).then((prod) => {
				for (let i = 0; i < prod.data.length; i++) {
					if (this.products[i].qty > 0) {
						this.tablMail =
							this.tablMail +
							"<tr style='text-align:center'><td style='border: 1px solid black;width:100px;height:50px;'>" +
							this.products[i].product +
							"<td style='border: 1px solid black;width:80px;height:50px;'>" +
							this.products[i].qty +
							"<td style='border: 1px solid black;width:80px;height:50px;'>" +
							this.products[i].unity;

						localStorage.removeItem(this.products[i].id);

						axios({
							method: "post",
							url:
								process.env.VUE_APP_API +
								"order/createorder/" +
								this.userId +
								"/" +
								this.deliveryDate,
							data: {
								productId: this.products[i].id,
								quantity: this.products[i].qty,
								order_date: Date.now(),
							},
							headers: {
								Authorization: `Bearer ${this.token}`,
							},
						})
							.then(() => {
								console.log("order saved !");
								//send email confirmation
								axios({
									method: "post",
									url:
										process.env.VUE_APP_API +
										"order/emailconf/" +
										this.userId +
										"/" +
										this.deliveryDate +
										"/" +
										this.tablMail,

									headers: {
										Authorization: `Bearer ${this.token}`,
									},
								})
									.then(() => {
										this.products = [];
										// localStorage.clear();
										this.total = 0;
										localStorage.removeItem("Total");
										this.dialog = true;
									})
									.catch((err) => {
										// this.infoOrder = err;
										console.log(err);
									});
							})
							.catch((err) => {
								console.log(err);
							});
					}
				}
			});
		},
		//* Add product to the order
		addQty: function(event, prod) {
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
		},
		//* Substract product to the order
		subQty: function(event, prod) {
			console.log("g appuyé sur sub");
			if (localStorage.getItem(prod.id) !== null) {
				if (JSON.parse(localStorage.getItem(prod.id)) === 1) {
					localStorage.removeItem(prod.id);
					localStorage.setItem("Total", JSON.parse(localStorage.getItem("Total")) - 1);
					prod.qty = 0;
				} else {
					console.log("je dois décrémenter !");
					localStorage.setItem(prod.id, JSON.parse(localStorage.getItem(prod.id)) - 1);
					prod.qty = localStorage.getItem(prod.id);
				}
			}
			this.$store.commit("setTotal", localStorage.getItem("Total"));
			if (localStorage.getItem("Total") == 0) {
				location.reload();
			}
		},
		//* Close Dialog
		closeConfirm: function() {
			this.dialog = false;
			this.$router.push("http://localhost:8080/produits_vente_commande");
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
	width: 10vw;
	height: 40px;
	color: #122f1c;
}
th {
	height: 40px;
	background-color: #fbc02d;
	color: white;
}
table,
caption {
	border-collapse: collapse;
	margin: auto;
	height: 5vh;
	/* color: #122f1c; */
}
caption {
	font-weight: 800;
	padding: 1vh;
	background-color: #fbc02d;
}
td {
	background-color: white;
	color: #122f1c;
	border: 1px solid #fbc02d;
}
.valid {
	font-weight: bold;
	width: 16vw;
	margin: auto;
	margin-top: 1rem;
}
#butAddSub {
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
@media only screen and (max-width: 768px) {
	/*mobiles et tablettes*/
	.valid {
		width: 20vw;
	}
	table {
		font-size: 0.8rem;
	}
	.addsub {
		font-size: 18px;
		margin-inline: 5px;
	}
	.sub {
		padding: 0px 6px 5px 6px;
	}
}

@media only screen and (max-width: 576px) {
	/*mobiles */
	.valid {
		width: 50vw;
		font-size: 0.8rem;
	}
}
</style>
