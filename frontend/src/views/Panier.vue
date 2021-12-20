<template>
	<div>
		<!-- Table pour le panier de commande -->
		<div v-if="total === null || total == 0">
			<p>
				{{ info }}
			</p>
		</div>
		<!-- Table for other than escargots -->
		<div class="commande" v-if="total > 0 && other_escarg > 0">
			<h5>Vos articles seront livrés le {{ deliveryDate }}.</h5>

			<table>
				<!-- <caption>
					Votre commande
				</caption> -->
				<tr>
					<th>Produit</th>
					<th>Quantité</th>
					<th>Unité</th>
					<th>Modification</th>
				</tr>
				<tr v-for="prod in products" :key="prod.id">
					<td v-if="prod.qty > 0 && prod.producerId != 16">{{ prod.product }}</td>
					<td v-if="prod.qty > 0 && prod.producerId != 16">{{ prod.qty }}</td>
					<td v-if="prod.qty > 0 && !prod.unity && prod.producerId != 16">
						<span>{{ prod.unity_kg }}</span>
					</td>
					<td v-if="prod.qty > 0 && prod.unity && prod.producerId != 16">
						{{ prod.unity }}
					</td>
					<td v-if="prod.qty > 0 && prod.producerId != 16">
						<p class="butAddSub">
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

			<div v-if="!ordered && escarg < 1">
				<Button
					label="Valider la commande"
					class=" p-button-raised p-button-primary valid"
					@click="validOrder"
				/>
			</div>
			<div v-if="ordered && escarg < 1">
				<ProgressSpinner />
			</div>
		</div>
		<!-- Table for only escargots -->
		<div class="commande escar" v-if="total > 0 && escarg > 0">
			<h5>Vos articles seront livrés le {{ deliveryDateNextW }}.</h5>

			<table>
				<!-- <caption>
					Votre commande
				</caption> -->
				<tr>
					<th>Produit</th>
					<th>Quantité</th>
					<th>Unité</th>
					<th>Modification</th>
				</tr>
				<tr v-for="prod in products" :key="prod.id">
					<td v-if="prod.qty > 0 && prod.producerId === 16">{{ prod.product }}</td>
					<td v-if="prod.qty > 0 && prod.producerId === 16">{{ prod.qty }}</td>
					<td v-if="prod.qty > 0 && !prod.unity && prod.producerId === 16">
						<span>{{ prod.unity_kg }}</span>
					</td>
					<td v-if="prod.qty > 0 && prod.unity && prod.producerId === 16">
						{{ prod.unity }}
					</td>
					<td v-if="prod.qty > 0 && prod.producerId === 16">
						<p class="butAddSub">
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

			<div v-if="!ordered && escarg > 0">
				<Button
					label="Valider la commande"
					class=" p-button-raised p-button-primary valid"
					@click="validOrder"
				/>
			</div>
			<div v-if="ordered && escarg > 0">
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
					{{ message }}
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
			escarg: JSON.parse(localStorage.getItem("escarg")),
			other_escarg: JSON.parse(localStorage.getItem("other_escarg")),
			products: [],
			tablMail: "",
			tablMail_escarg: "",
			info: "Votre panier est actuellement vide.",
			dialog: false,
			ordered: false,
			unitee: "",
			counter: 0,
			counter_escarg: 0,
			counter_other: 0,
			message:
				"Votre commande a été enregistrée. Vous allez recevoir un email de confirmation.",
			delivery_day_gene: "",
		};
	},
	computed: {
		...mapGetters(["deliveryDate", "deliveryDateNextW"]),
		...mapState(["order", "userId", "connected", "inPages", "token"]),
	},
	created: function() {
		this.$store.dispatch("checkConnect");
		if (!this.connected) {
			this.$router.push("/");
		} else {
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
						unity_kg: prod.data[c].unite_vente,
						unity: prod.data[c].unity,
						price_unity: prod.data[c].price_unite_vente,
						producerId: prod.data[c].producerId,
						qty: localStorage.getItem(prod.data[c].id),
					});
				}
				console.log(this.products);
			});
		}
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
			this.$store.dispatch("checkConnect");
			if (!this.connected) {
				localStorage.setItem("disconnect", "disconnected");

				this.$router.push("/");
			} else {
				this.ordered = true;
				// Save in database and send 1 email for non escargots and 1 email for escargots

				axios({
					method: "get",
					url: process.env.VUE_APP_API + "product/getproducts/actived",
				}).then((prod) => {
					for (let i = 0; i < prod.data.length; i++) {
						if (this.products[i].qty > 0) {
							if (this.products[i].unity) {
								this.unitee = this.products[i].unity;
							} else {
								this.unitee = this.products[i].unity_kg;
							}
							// if escargots ordered
							if (this.products[i].producerId === 16) {
								this.counter_escarg =
									this.counter_escarg + JSON.parse(this.products[i].qty);
								this.tablMail_escarg =
									this.tablMail_escarg +
									"<tr style='text-align:center'><td style='border: 1px solid black;width:150px;height:50px;'>" +
									encodeURIComponent(this.products[i].product) +
									"<td style='border: 1px solid black;width:80px;height:50px;'>" +
									this.products[i].qty +
									"<td style='border: 1px solid black;width:80px;height:50px;'>" +
									encodeURIComponent(this.unitee);
								this.delivery_day_gene = this.deliveryDateNextW;
							} else {
								this.counter_other =
									this.counter_other + JSON.parse(this.products[i].qty);
								this.tablMail =
									this.tablMail +
									"<tr style='text-align:center'><td style='border: 1px solid black;width:150px;height:50px;'>" +
									encodeURIComponent(this.products[i].product) +
									"<td style='border: 1px solid black;width:80px;height:50px;'>" +
									this.products[i].qty +
									"<td style='border: 1px solid black;width:80px;height:50px;'>" +
									encodeURIComponent(this.unitee);
								this.delivery_day_gene = this.deliveryDate;
							}
							localStorage.removeItem(this.products[i].id);

							axios({
								method: "post",
								url:
									process.env.VUE_APP_API +
									"order/createorder/" +
									this.userId +
									"/" +
									this.delivery_day_gene,
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
									console.log("order  saved !");
									this.counter++;
									console.log(JSON.parse(localStorage.getItem("Total")));
									//send email confirmation
									//for escargots
									if (
										this.counter_escarg ===
											JSON.parse(localStorage.getItem("escarg")) &&
										this.counter === JSON.parse(localStorage.getItem("Total"))
									) {
										axios({
											method: "post",
											url:
												process.env.VUE_APP_API +
												"order/emailconf/" +
												this.userId +
												"/" +
												this.deliveryDateNextW +
												"/" +
												this.tablMail_escarg,

											headers: {
												Authorization: `Bearer ${this.token}`,
											},
										})
											.then(() => {
												this.products = [];
												this.total = 0;
												localStorage.removeItem("Total");
												localStorage.removeItem("escarg");
												if (this.counter_other > 0) {
													this.message =
														"Vos 2 commandes ont été enregistrées. Vous allez recevoir 2 emails de confirmation.";
													this.dialog = true;
												} else {
													this.message =
														"Votre commande a été enregistrée. Vous allez recevoir un email de confirmation.";
													this.dialog = true;
												}
											})
											.catch((err) => {
												console.log(err);
											});
									}
									//for other_escargots
									if (
										this.counter_other ===
											JSON.parse(localStorage.getItem("other_escarg")) &&
										this.counter === JSON.parse(localStorage.getItem("Total"))
									) {
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
												this.total = 0;
												localStorage.removeItem("Total");
												localStorage.removeItem("other_escarg");
												if (this.counter_escarg > 0) {
													this.message =
														"Vos 2 commandes ont été enregistrées. Vous allez recevoir 2 emails de confirmation.";
													this.dialog = true;
												} else {
													this.message =
														"Votre commande a été enregistrée. Vous allez recevoir un email de confirmation.";
													this.dialog = true;
												}
											})
											.catch((err) => {
												console.log(err);
											});
									}
								})
								.catch((err) => {
									console.log(err);
								});
						}
					}
				});
			}
		},
		//* Add product to the order
		addQty: function(event, prod) {
			this.$store.dispatch("checkConnect");
			if (!this.connected) {
				this.$router.push("/");
			} else {
				if (localStorage === null) {
					localStorage.setItem("Total", 1);
					localStorage.setItem(prod.id, 1);
					prod.qty = 1;
					if (prod.producerId === 16) {
						// If escargots selected
						localStorage.setItem("escarg", 1);
					} else {
						localStorage.setItem("other_escarg", 1);
					}
				} else {
					if (localStorage.getItem(prod.id) !== null) {
						localStorage.setItem(
							prod.id,
							JSON.parse(localStorage.getItem(prod.id)) + 1
						);
						prod.qty = localStorage.getItem(prod.id);
					} else {
						localStorage.setItem(prod.id, 1);
						localStorage.setItem(
							"Total",
							JSON.parse(localStorage.getItem("Total")) + 1
						);
						prod.qty = 1;
					}
					if (prod.producerId === 16) {
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
				this.$store.commit("setTotal", localStorage.getItem("Total"));
			}
		},
		//* Substract product to the order
		subQty: function(event, prod) {
			this.$store.dispatch("checkConnect");
			if (!this.connected) {
				this.$router.push("/");
			} else {
				console.log("g appuyé sur sub");
				if (localStorage.getItem(prod.id) !== null) {
					if (JSON.parse(localStorage.getItem(prod.id)) === 1) {
						localStorage.removeItem(prod.id);
						localStorage.setItem(
							"Total",
							JSON.parse(localStorage.getItem("Total")) - 1
						);
						prod.qty = 0;
						if (prod.producerId === 16) {
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
						console.log("je dois décrémenter !");
						localStorage.setItem(
							prod.id,
							JSON.parse(localStorage.getItem(prod.id)) - 1
						);
						prod.qty = localStorage.getItem(prod.id);
						if (prod.producerId === 16) {
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
				if (localStorage.getItem("Total") == 0) {
					location.reload();
				}
				if (localStorage.getItem("escarg") == 0) {
					location.reload();
				}
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
.commande {
	display: flex;
	flex-direction: column;
}
.escar {
	margin-top: 1rem;
}
h5 {
	margin-bottom: 1rem;
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
/* caption {
	font-weight: 800;
	padding: 1vh;
	background-color: #fbc02d;
} */
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
	margin-bottom: 2rem;
}
.butAddSub {
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
