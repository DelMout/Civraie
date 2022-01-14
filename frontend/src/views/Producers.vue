<template>
	<div id="producersTable">
		<div id="title">
			<h3>Liste des producteurs</h3>
			<p id="number">Nombre producteurs = {{ length }}</p>
		</div>

		<div>
			<Dialog header="Confirmation" v-model:visible="dialog" :style="{ width: '15vw' }"
				><p>{{ infoProd }}</p>
				<template #footer>
					<Button label="OK" @click="close" autofocus />
				</template>
			</Dialog>
		</div>

		<div style="width:30vw">
			<Toast position="center">
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

		<div id="tableau">
			<table>
				<tr>
					<th>Producteur</th>
					<th>Nom</th>
					<th class="">Prénom</th>
					<th class="">Produits proposés</th>
					<th class="">Adresse</th>
					<th class="">Téléphone</th>
					<th class="">Email</th>
				</tr>
				<tr v-for="prod in producers" :key="prod.id" :id="prod.delete">
					<td @click="modifProd($event, prod)">
						<p v-if="!prod.modif || prod.delete">{{ prod.entreprise }}</p>
						<input
							v-if="prod.modif && !prod.delete"
							class="create "
							type="text"
							v-model="prod.entreprise"
						/>
					</td>

					<td @click="modifProd($event, prod)">
						<p v-if="!prod.modif || prod.delete">
							{{ prod.nom }}
						</p>
						<input
							v-if="prod.modif && !prod.delete"
							class="create "
							type="text"
							v-model="prod.nom"
						/>
					</td>
					<td @click="modifProd($event, prod)">
						<p v-if="!prod.modif || prod.delete">{{ prod.prenom }}</p>
						<input
							v-if="prod.modif && !prod.delete"
							class="create "
							type="text"
							v-model="prod.prenom"
						/>
					</td>

					<td @click="modifProd($event, prod)">
						<p v-if="!prod.modif || prod.delete">{{ prod.products }}</p>
						<input
							v-if="prod.modif && !prod.delete"
							class="create "
							type="text"
							v-model="prod.products"
						/>
					</td>
					<td @click="modifProd($event, prod)">
						<p v-if="!prod.modif || prod.delete">{{ prod.address }}</p>
						<input
							v-if="prod.modif && !prod.delete"
							class="create "
							type="text"
							v-model="prod.address"
						/>
					</td>
					<td @click="modifProd($event, prod)">
						<p v-if="!prod.modif || prod.delete">{{ prod.phone }}</p>
						<input
							v-if="prod.modif && !prod.delete"
							class="create "
							type="text"
							v-model="prod.phone"
						/>
					</td>
					<td @click="modifProd($event, prod)">
						<p v-if="!prod.modif || prod.delete">{{ prod.email }}</p>
						<input
							v-if="prod.modif && !prod.delete"
							class="create "
							type="text"
							v-model="prod.email"
						/>
					</td>

					<td v-if="prod.modif" id="sup">
						<Button
							v-if="prod.modif && !prod.delete"
							style="background-color:rgb(252, 190, 76);color:black;border:none"
							icon="pi pi-check"
							class="p-button-rounded butt"
							@click="validMod($event, prod)"
						/>
					</td>
				</tr>
				<!-- Row for creating new producer -->
				<tr class="create">
					<td>
						<input class="create" type="text" id="entreprise" v-model="entreprise" />
					</td>

					<td>
						<input class="create " type="text" id="nom" v-model="nom" />
					</td>
					<td>
						<input class="create " type="text" id="prenom" v-model="prenom" />
					</td>
					<td>
						<input class="create " type="text" id="produits" v-model="produits" />
					</td>
					<td>
						<input class="create " type="text" id="adresse" v-model="adresse" />
					</td>
					<td>
						<input class="create " type="text" id="telephone" v-model="telephone" />
					</td>
					<td>
						<input class="create " type="text" id="email" v-model="email" />
					</td>

					<td id="creer">
						<Button
							style="background:rgb(252, 190, 76)"
							label="Créer"
							class="p-button-raised validModif  valCreate"
							@click="validateCreate"
						/>
					</td>
				</tr>
				<p><i>* Champs obligatoires</i></p>
			</table>
		</div>
	</div>
</template>
<script>
import axios from "axios";
import { mapState, mapActions } from "vuex";

export default {
	data() {
		return {
			infoProd: "",
			producers: [],
			length: "",
			entreprise: "* Producteur",
			nom: "* Nom",
			prenom: "Prénom",
			produits: "* Produits proposés",
			adresse: "* Adresse",
			telephone: "Téléphone",
			email: "Email",
			dialog: false,
		};
	},
	beforeMount: function() {
		this.$store.dispatch("checkConnect");
	},
	beforeCreate: function() {
		this.producers = [];
	},
	created: function() {
		this.$store.state.inPages = true;
		//* All producers
		axios({
			method: "get",
			url: process.env.VUE_APP_API + "producer",
			headers: {
				Authorization: `Bearer ${this.token}`,
			},
		}).then((prod) => {
			this.length = prod.data.length;
			for (let i = 0; i < this.length; i++) {
				this.producers.push({
					id: prod.data[i].id,
					nom: prod.data[i].nom,
					prenom: prod.data[i].prenom,
					entreprise: prod.data[i].entreprise,
					products: prod.data[i].products,
					address: prod.data[i].address,
					phone: prod.data[i].phone,
					email: prod.data[i].email,
					modif: 0,
					delete: 0,
				});
				// sort by alpha order
				this.producers.sort(function(a, b) {
					var entrepriseA = a.entreprise.toUpperCase();
					var entrepriseB = b.entreprise.toUpperCase();

					if (entrepriseA < entrepriseB) {
						return -1;
					}
					if (entrepriseA > entrepriseB) {
						return 1;
					}
					return 0;
				});
			}
		});
	},
	computed: {
		...mapState(["token", "connected"]),
	},
	methods: {
		...mapActions(["checkConnect"]),
		//* Create a producer
		validateCreate: function() {
			this.$store.dispatch("checkConnect");
			if (!this.connected) {
				this.$router.push("/");
			} else {
				axios({
					method: "post",
					url: process.env.VUE_APP_API + "producer/createproducer",
					data: {
						nom: this.nom,
						prenom: this.prenom,
						entreprise: this.entreprise,
						products: this.produits,
						address: this.adresse,
						phone: this.telephone,
						email: this.email,
					},
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				})
					.then(() => {
						this.dialog = true;
						this.infoProd = "Producteur créé !";
					})
					.catch(() => {
						this.$toast.add({
							severity: "error",
							detail:
								"Les champs 'Producteur', 'Nom', 'Produits proposés' et 'Adresse' sont obligatoires.",
							closable: false,
							life: 4000,
						});
					});
			}
		},

		//* Want to modify a producer
		modifProd: function(event, prod) {
			prod.modif = true;
		},

		// //* Validation modifications
		validMod: function(event, prod) {
			this.$store.dispatch("checkConnect");
			if (!this.connected) {
				this.$router.push("/");
			} else {
				const id = prod.id;

				axios({
					method: "put",
					url: process.env.VUE_APP_API + "producer/modif/" + id,
					data: {
						nom: prod.nom,
						prenom: prod.prenom,
						entreprise: prod.entreprise,
						products: prod.products,
						address: prod.address,
						phone: prod.phone,
						email: prod.email,
					},
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				})
					.then(() => {
						prod.modif = false;
					})
					.catch(() => {
						this.$toast.add({
							severity: "error",
							detail: "Problème ! Les modifications n'ont pas été prises en compte.",
							closable: false,
							life: 4000,
						});
					});
			}
		},

		//* Close Dialog
		close: function() {
			this.dialog = false;
			location.reload();
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
	margin-bottom: 1rem;
	margin-left: 5rem;
}
#number {
	margin: 0;
	font-size: 12px;
	margin-top: 0.2rem;
}
#producersTable {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
#tableau {
	margin: auto;
	width: 95%;
}
td,
th {
	border: 1px solid black;
}
td,
th,
input,
.valCreate {
	height: 40px;
}
th,
input {
	width: 200px;
}
th {
	height: 3rem;
	background-color: rgb(235, 141, 47);
	color: black;
}
tr {
	width: 50%;
	background-color: white;
	color: black;
}

.numb {
	width: 80px;
}
.photo {
	width: 120px;
}
table {
	border-collapse: collapse;
	margin: auto;
	margin-bottom: 2rem;
}
.create,
.valCreate {
	background-color: rgb(252, 190, 76);
}
#green {
	background-color: rgb(252, 190, 76);
}
#red {
	background-color: red;
	color: white;
}
.nocolor {
	background-color: white;
}
#sup,
#creer {
	border: 0px solid;
	width: 100px;
	background-color: #122f1c;
}
.butt {
	margin-right: 50px;
}
.validModif {
	background-color: pink;
	color: black;
	margin-bottom: 4px;
}
</style>
