<template>
	<div>
		<div id="productsTable">
			<div id="title">
				<h3>Gestion des stocks</h3>
				<p id="number">Produits actifs et non actifs.</p>
			</div>
			<div>
				<p>
					<span id="exclam" class="pi pi-exclamation-triangle"></span> Veillez à bien
					remettre à jour le stock initial car seulement le "stock mis à jour" est pris en
					compte.
				</p>
			</div>

			<ConfirmPopup></ConfirmPopup>
			<ConfirmPopup group="demo">
				<template #message="slotProps">
					<div class="p-d-flex p-p-4">
						<i :class="slotProps.message.icon" style="font-size: 1.5rem"></i>
						<p class="p-pl-2">{{ slotProps.message.message }}</p>
					</div>
				</template>
			</ConfirmPopup>

			<div id="tableau">
				<table>
					<tr>
						<th>Produit</th>
						<th class="numb">Prix</th>
						<th>Unité / prix</th>
						<th>Unité vente</th>
						<th class="numb">Stock initial</th>
						<th>Date stock initial</th>
						<th class="numb">Stock mis à jour</th>
					</tr>
					<tr v-for="prod in products" :key="prod.id" :id="prod.delete">
						<td @click="modifProd($event, prod)" :class="prod.modif">
							<p>{{ prod.product }}</p>
						</td>

						<td class="numb" @click="modifProd($event, prod)" :class="prod.modif">
							<p>{{ prod.price }} <span> €</span></p>
						</td>
						<td @click="modifProd($event, prod)" :class="prod.modif">
							<p>
								{{ prod.unite_vente }}
							</p>
						</td>
						<td @click="modifProd($event, prod)" :class="prod.modif">
							<p>
								{{ prod.unity }}
							</p>
						</td>
						<td class="numb light" @click="modifProd($event, prod)" :class="prod.modif">
							<p v-if="!prod.modif">
								{{ prod.stock_init }}
							</p>
							<input
								v-if="prod.modif"
								class="light"
								type="text"
								v-model="prod.stock_init"
							/>
						</td>
						<td @click="modifProd($event, prod)" :class="prod.modif">
							<p v-if="prod.stock_in_date">
								{{ dateFr(prod.stock_in_date) }}
							</p>
						</td>
						<td class="numb" @click="modifProd($event, prod)" :class="prod.modif">
							<p>
								{{ prod.stock_updated }}
							</p>
						</td>

						<td v-if="prod.modif" class="valButton ">
							<Button
								v-if="prod.modif && !prod.delete"
								id=""
								label="Modifier"
								class="p-button-raised validModif valButton p-button-warning"
								@click="validModif($event, prod)"
							/>
						</td>
					</tr>
				</table>
			</div>
		</div>
		<div style="width:30vw">
			<Toast position="center" :breakpoints="{ '400px': { width: '95%' } }">
				<template #message="slotProps">
					<div class="p-d-flex p-flex-row">
						<div class="p-text-center">
							<i class="pi pi-exclamation-triangle" style="font-size: 2rem"></i>
							<p>{{ slotProps.message.detail }}</p>
						</div>
					</div>
				</template>
			</Toast>
		</div>
	</div>
</template>
<script>
import axios from "axios";
import moment from "moment";
import { mapState, mapActions } from "vuex";

export default {
	data() {
		return {
			products: [],
			length: "",
			modifInProgress: false,
			tamponId: "",
		};
	},
	beforeMount: function() {
		this.$store.dispatch("checkConnect");
	},
	beforeCreate: function() {
		this.products = [];
		this.producers = [];
	},
	created: function() {
		this.$store.dispatch("checkConnect");
		if (!this.connected) {
			this.$router.push("/");
		} else {
			this.$store.state.inPages = true;
			//* All products wth stock_manag
			axios({
				method: "get",
				url: process.env.VUE_APP_API + "product/getproducts/stockmanag",
				headers: {
					Authorization: `Bearer ${this.token}`,
				},
			}).then((prod) => {
				this.length = prod.data.length;
				for (let i = 0; i < this.length; i++) {
					this.products.push({
						id: prod.data[i].id,
						product: prod.data[i].product,
						price: prod.data[i].price,
						unite_vente: prod.data[i].unite_vente,
						unity: prod.data[i].unity,
						stock_init: prod.data[i].stock_init,
						stock_updated: prod.data[i].stock_updated,
						stock_in_date: prod.data[i].stock_in_date,
						photo: prod.data[i].photo,
						modif: 0,
					});
					// sort alpha order
					this.products.sort(function(a, b) {
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
				}
			});
		}
	},
	computed: {
		...mapState(["token", "connected"]),
	},
	methods: {
		...mapActions(["checkConnect"]),

		//* Put in french date
		dateFr: function(date) {
			moment.locale("fr");
			return moment(date).format("DD/MM/YYYY");
		},

		//* Want to modify a product
		modifProd: function(event, prod) {
			if (!this.modifInProgress) {
				prod.modif = "yellow";
				this.tamponId = prod.id;
				this.modifInProgress = true;
			} else {
				if (prod.id != this.tamponId) {
					this.products.forEach((item) => {
						if (item.id === this.tamponId) {
							item.modif = 0;
							this.modifInProgress = false;
						}
					});
				}
			}
		},

		//* Validation modifications
		validModif: function(event, prod) {
			this.$store.dispatch("checkConnect");
			if (!this.connected) {
				this.$router.push("/");
			} else {
				const id = prod.id;

				const formData = new FormData();
				formData.append("stock_init", prod.stock_init);
				formData.append("stock_updated", prod.stock_init);
				formData.append("stock_in_date", moment().format("YYYY-MM-DD"));
				axios({
					method: "put",
					url: process.env.VUE_APP_API + "product/modif/" + id,
					data: formData,
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				})
					.then(() => {
						prod.modif = false;
						location.reload();
					})
					.catch(() => {
						this.$toast.add({
							severity: "error",
							detail: "Erreur ! Votre modification n'a pas été prise en compte.",
							closable: false,
							life: 4000,
						});
					});
			}
		},
	},
};
</script>
<style scoped>
h3 {
	margin: 0;
	margin-right: 2rem;
	text-align: right;
	margin-left: 5rem;
}
#title {
	display: flex;
	justify-content: space-around;
	margin-top: 0rem;
	margin-left: 5rem;
}

#productsTable {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
#tableau {
	margin: auto;
	width: 100%;
}
td,
th {
	border: 1px solid black;
}
td,
input {
	height: 5rem;
}
th {
	height: 3rem;
	background-color: rgb(235, 141, 47);
	color: black;
}
th,
td {
	width: 10rem;
}
input {
	width: 5rem;
}
tr {
	width: 50%;
	background-color: white;
	color: black;
}
.numb {
	width: 5rem;
}
.photo {
	width: 5rem;
}
table {
	border-collapse: collapse;
	width: 80vw;
	margin-right: auto;
	margin-left: auto;
	margin-bottom: 5rem;
}
.valButton {
	font-size: 1rem;
	padding-right: 0;
	padding-left: 0;
	width: 6rem;
	background-color: #122f1c;
	border: 0px solid;
	margin-left: 5px;
}
.validModif {
	background-color: #fbc02d;
	color: black;
	margin-bottom: 4px;
}
#toDelete {
	background-color: white;
	font-weight: bolder;
}
#toCreate {
	font-weight: bolder;
	color: black;
}
.create {
	background-color: #fbc02d;
	width: 10rem;
}
.createProd {
	height: 2.5rem;
	background-color: #fbc02d;
}
.valCreate {
	height: 2.5rem;
}
.uploadFile {
	display: inline-block;
	position: relative;
	overflow: hidden;
}

#green {
	background-color: #fbc02d;
}
#red {
	background-color: #d32f2f;
	color: white;
}
.yellow {
	background-color: #fbc02d;
}
.nocolor {
	background-color: white;
}
.active {
	width: 1.5rem;
	height: 1.5rem;
	border-radius: 50%;
	margin-left: 0;
	cursor: pointer;
}
.stock {
	width: 1.5rem;
	height: 1.5rem;
	margin-left: 0;
	cursor: pointer;
}
.on {
	background-color: greenyellow;
	color: black;
}
.off {
	background-color: red;
}
.on_stock {
	background-color: rgb(20, 243, 243);
}
.off_stock {
	background-color: rgb(224, 213, 213);
}

#allactived {
	margin-left: 5rem;
}
::v-deep(.p-dropdown) {
	background-color: #fbc02d;
}
#toBottom {
	margin-left: 5rem;
}
#selProd {
	background-color: #a3d7a5;
	margin-left: 2rem;
	margin-right: 0.3rem;
	width: 20rem;
	text-align: left;
}
#selAll {
	background-color: #a3d7a5;
	color: rgb(92, 91, 91);
}
.light {
	background-color: yellow;
}
#number {
	margin: 0;
	font-size: 12px;
	margin-top: 0.2rem;
}
#exclam {
	color: red;
	font-size: 1.5rem;
	margin-bottom: 1rem;
}
</style>
