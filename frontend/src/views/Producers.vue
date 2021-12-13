<template>
	<div id="producersTable">
		<div id="title">
			<h3>Liste des producteurs</h3>
			<p id="number">Nombre producteurs = {{ length }}</p>
			<p id="suppProd">Supprimer un producteur engendre la suppression des produits.</p>
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
					<th>Site web</th>
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

					<td class="" @click="modifProd($event, prod)">
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

					<td class="" @click="modifProd($event, prod)">
						<p v-if="!prod.modif || prod.delete">{{ prod.products }}</p>
						<input
							v-if="prod.modif && !prod.delete"
							class="create "
							type="text"
							v-model="prod.products"
						/>
					</td>
					<td class="" @click="modifProd($event, prod)">
						<p v-if="!prod.modif || prod.delete">{{ prod.address }}</p>
						<input
							v-if="prod.modif && !prod.delete"
							class="create "
							type="text"
							v-model="prod.address"
						/>
					</td>
					<td class="" @click="modifProd($event, prod)">
						<p v-if="!prod.modif || prod.delete">{{ prod.phone }}</p>
						<input
							v-if="prod.modif && !prod.delete"
							class="create "
							type="text"
							v-model="prod.phone"
						/>
					</td>
					<td class="" @click="modifProd($event, prod)">
						<p v-if="!prod.modif || prod.delete">{{ prod.email }}</p>
						<input
							v-if="prod.modif && !prod.delete"
							class="create "
							type="text"
							v-model="prod.email"
						/>
					</td>
					<td class="" @click="modifProd($event, prod)">
						<p v-if="!prod.modif || prod.delete">{{ prod.site_web }}</p>
						<input
							v-if="prod.modif && !prod.delete"
							class="create "
							type="text"
							v-model="prod.site_web"
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

						<Button
							v-if="prod.modif"
							id="trash"
							icon="pi pi-trash"
							class=" p-button-rounded p-button-danger butt"
							@click="wantDelete($event, prod)"
						/>
					</td>
				</tr>
				<!-- Row for creating new producer -->
				<tr class="create">
					<td>
						<input class="create" type="text" id="entreprise" v-model="entreprise" />
					</td>

					<td class="">
						<input class="create " type="text" id="nom" v-model="nom" />
					</td>
					<td class="">
						<input class="create " type="text" id="prenom" v-model="prenom" />
					</td>
					<td class="">
						<input class="create " type="text" id="produits" v-model="produits" />
					</td>
					<td class="">
						<input class="create " type="text" id="adresse" v-model="adresse" />
					</td>
					<td class="">
						<input class="create " type="text" id="telephone" v-model="telephone" />
					</td>
					<td class="">
						<input class="create " type="text" id="email" v-model="email" />
					</td>
					<td class="">
						<input class="create " type="text" id="site" v-model="site" />
					</td>

					<td id="creer">
						<Button
							style="background:rgb(252, 190, 76)"
							label="Créer"
							class="p-button-raised validModif valButton valCreate"
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
			lengthPc: "",
			entreprise: "* Producteur",
			nom: "* Nom",
			prenom: "Prénom",
			produits: "* Produits proposés",
			adresse: "* Adresse",
			telephone: "Téléphone",
			email: "Email",
			site: "Site web",
			photo: "", // total name paste in database
			image: null, // file received brut
			prodId: "",
			modif: false,
			index: "",
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
					site_web: prod.data[i].site_web,
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
				console.log(this.producers);
			}
		});
	},
	computed: {
		...mapState(["token"]),
	},
	methods: {
		...mapActions(["checkConnect"]),
		// //* Create a producer
		validateCreate: function() {
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
					site_web: this.site,
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
		},

		//* Want to modify a producer
		modifProd: function(event, prod) {
			prod.modif = true;
		},

		//* Validation modifications
		validMod: function(event, prod) {
			const id = prod.id;
			const formData = new FormData();
			formData.append("nom", prod.nom);
			formData.append("prenom", prod.prenom);
			formData.append("entreprise", prod.entreprise);
			formData.append("products", prod.products);
			formData.append("address", prod.address);
			formData.append("phone", prod.phone);
			formData.append("email", prod.email);
			formData.append("site_web", prod.site_web);
			console.log(prod.address);
			// axios({
			// 	method: "put",
			// 	url: process.env.VUE_APP_API + "producer/modif/" + id,
			// 	data: formData,
			// 	headers: {
			// 		Authorization: `Bearer ${this.token}`,
			// 	},
			// })
			axios
				.put(process.env.VUE_APP_API + "producer/modif/" + id, formData)
				.then((rep) => {
					prod.modif = false;
					console.log(rep);
					console.log("heu hooo !!" + id);
					//! Y a porbleme ici !!!
				})
				.catch((err) => console.log(err));
		},

		//* Want delete a product
		wantDelete: function(event, prod) {
			prod.delete = "red";
			this.$confirm.require({
				target: event.currentTarget,
				message: "Souhaitez-vous supprimer ce producteur ?",
				icon: "pi pi-info-circle",
				acceptClass: "p-button-danger",
				accept: () => {
					this.Delete(event, prod);
				},
				reject: () => {
					prod.delete = 0;
				},
			});
		},

		//* Delete product
		Delete: function(event, prod) {
			const id = prod.id;
			axios({
				method: "delete",
				url: process.env.VUE_APP_API + "producer/delete/" + id,
				headers: {
					Authorization: `Bearer ${this.token}`,
				},
			}).then(() => {
				this.dialog = true;
				this.infoProd = "La ligne du producteur a été supprimée.";
			});
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
#suppProd {
	margin: 0;
	font-size: 12px;
	margin-top: 0.2rem;
	margin-left: 1rem;
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
	margin-right: 5px;
}
.validModif {
	background-color: pink;
	color: black;
	margin-bottom: 4px;
}
</style>
