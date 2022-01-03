<template>
	<div>
		<div id="productsTable">
			<div id="title">
				<h3>Jours de clôture des Catégories</h3>
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
						<th class="numb">Catégorie</th>
						<th class="numb">Jour clôture</th>
					</tr>
					<tr v-for="cat in categories" :key="cat.id" :id="cat.delete">
						<td class="numb" @click="modifcat($event, cat)" :class="cat.modif">
							<p>{{ cat.category }}</p>
						</td>

						<td class="numb" @click="modifcat($event, cat)" :class="cat.modif">
							<p v-if="!cat.modif">
								{{ cat.cloture_day }}
							</p>
							<Dropdown
								v-if="cat.modif"
								v-model="clotureModel"
								:options="days"
								optionLabel="name"
								:placeholder="cat.cloture_day"
							/>
						</td>

						<td class="valButton ">
							<Button
								v-if="cat.modif"
								id="momodif"
								label="Modifier"
								class="p-button-raised validModif  p-button-warning"
								@click="validModif($event, cat)"
							/>
						</td>
					</tr>
				</table>
			</div>
		</div>
	</div>
</template>
<script>
import axios from "axios";
import { mapState, mapActions } from "vuex";

export default {
	data() {
		return {
			categories: [],
			length: "",
			name: "",
			price: "",
			qtyMini: "",
			unity: "",
			PriceQtyMini: "",
			stockInit: "",
			stockLimit: "",
			priceKgM: "",

			prodId: "",
			modif: false,
			index: "",
			modifInProgress: false,
			tamponId: "",
			unitee: "",
			clotureModel: null,
			days: [
				{ name: "Dimanche" },
				{ name: "Lundi" },
				{ name: "Mardi" },
				{ name: "Mercredi" },
				{ name: "Jeudi" },
			],
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
		this.$store.state.inPages = true;
		//* All products wth stock_manag
		axios({
			method: "get",
			url: process.env.VUE_APP_API + "category/getcategories",
			headers: {
				Authorization: `Bearer ${this.token}`,
			},
		}).then((cat) => {
			this.length = cat.data.length;
			for (let i = 0; i < this.length; i++) {
				this.categories.push({
					id: cat.data[i].id,
					category: cat.data[i].category,
					cloture_day: cat.data[i].cloture_day,
					priority: cat.data[i].priority,
					modif: 0,
				});
				// sort alpha order
				this.categories.sort(function(a, b) {
					var catA = a.priority;
					var catB = b.priority;

					if (catA < catB) {
						return -1;
					}
					if (catA > catB) {
						return 1;
					}
					return 0;
				});
			}
			console.log(this.categories);
		});
	},
	computed: {
		...mapState(["token"]),
	},
	methods: {
		...mapActions(["checkConnect"]),

		//* Want to modify the cloture_day
		modifcat: function(event, cat) {
			if (!this.modifInProgress) {
				cat.modif = "yellow";
				this.tamponId = cat.id;
				this.modifInProgress = true;
			} else {
				if (cat.id != this.tamponId) {
					this.categories.forEach((item) => {
						if (item.id === this.tamponId) {
							item.modif = 0;
							this.modifInProgress = false;
						}
					});
				}
			}
		},

		//* Validation modifications
		validModif: function(event, cat) {
			console.log(this.clotureModel.name);
			const id = cat.id;
			axios({
				method: "put",
				url: process.env.VUE_APP_API + "category/modifclotureday/" + id,
				data: { cloture_day: this.clotureModel.name },
				headers: {
					Authorization: `Bearer ${this.token}`,
				},
			})
				.then(() => {
					cat.modif = false;
					location.reload();
				})
				.catch((err) => {
					console.log(err);
				});
		},
	},
};
</script>
<style scoped>
/* h3 {
	margin: 0;
	margin-right: 2rem;
	text-align: right;
	margin-left: 5rem;
} */
#title {
	display: flex;
	justify-content: space-around;
	margin-top: 0rem;
	/* margin-bottom: 1rem; */
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
	width: 84%;
	margin-left: 16vw;
}
td,
th {
	border: 1px solid black;
}
td {
	height: 3rem;
}
th {
	height: 3rem;
	background-color: rgb(235, 141, 47);
	color: black;
}
th,
td {
	width: 6rem;
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
	width: 40vw;
	margin-right: auto;
	margin-left: auto;
	margin-bottom: 5rem;
}

.valButton {
	font-size: 1rem;
	padding-right: 0;
	padding-left: 0;
	background-color: #122f1c;
	border: 0px solid;
}
.validModif {
	background-color: #fbc02d;
	color: black;
	margin-bottom: 4px;
	margin-left: 0;
	width: 6rem;
}
#momodif {
	margin: 0;
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
	/* border-radius: 50%; */
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
</style>
