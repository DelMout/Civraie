<template>
	<div>
		<h1>Liste des producteurs</h1>
		<p>{{ infoProd }}</p>

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

				<td v-if="prod.modif">
					<button
						v-if="prod.modif && !prod.delete"
						style="background-color:greenyellow;"
						class="modif"
						type="button"
						@click="validMod($event, prod)"
					>
						Valider les modifications
					</button>
					<button
						v-if="prod.modif && !prod.delete"
						style="background-color:red;color:white;"
						class="modif"
						type="button"
						@click="wantDelete($event, prod)"
					>
						Sup
					</button>
					<button
						v-if="prod.delete"
						style="background-color:white;color:red;"
						class="modif"
						type="button"
						@click="Delete($event, prod)"
					>
						Supprimer ce producteur
					</button>
				</td>
			</tr>
			<!-- Row for creating new producer -->
			<tr class="create">
				<td><input class="create" type="text" id="entreprise" v-model="entreprise" /></td>

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

				<td>
					<button class="valCreate" type="button" @click="validateCreate">
						Créer ce producteur
					</button>
				</td>
			</tr>
		</table>

		<p>Nombre producteurs = {{ length }}</p>
	</div>
</template>
<script>
import axios from "axios";

export default {
	data() {
		return {
			infoProd: "",
			producers: [],
			length: "",
			lengthPc: "",
			entreprise: "Producteur",
			nom: "Nom",
			prenom: "Prénom",
			produits: "Produits proposés",
			adresse: "Adresse",
			telephone: "Téléphone",
			email: "Email",
			site: "Site web",
			photo: "", // total name paste in database
			image: null, // file received brut
			prodId: "",
			modif: false,
			index: "",
		};
	},
	beforeCreate: function() {
		this.producers = [];
	},
	created: function() {
		//* All producers
		axios.get(process.env.VUE_APP_API + "producer").then((prod) => {
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
	methods: {
		// //* Create a producer
		validateCreate: function() {
			//! Vérifier conditions avant de créer, toutes les cases sont bien remplies ?
			axios
				.post(process.env.VUE_APP_API + "producer/createproducer", {
					nom: this.nom,
					prenom: this.prenom,
					entreprise: this.entreprise,
					products: this.produits,
					address: this.adresse,
					phone: this.telephone,
					email: this.email,
					site_web: this.site,
				})
				.then(() => {
					this.infoProd = "Producteur créé !";
				})
				.catch((err) => {
					this.infoProd = err;
				});
		},

		//* Want to modify a producer
		modifProd: function(event, prod) {
			prod.modif = true;
		},

		//* Validation modifications
		validMod: function(event, prod) {
			const id = prod.id;
			axios
				.put(process.env.VUE_APP_API + "producer/modif/" + id, {
					nom: prod.nom,
					prenom: prod.prenom,
					entreprise: prod.entreprise,
					products: prod.produits,
					address: prod.adresse,
					phone: prod.telephone,
					email: prod.email,
					site_web: prod.site,
				})
				// headers: {
				// 	Authorization: `Bearer ${this.token}`,
				// },

				.then(() => {
					prod.modif = false;
					this.infoProd = "Vos modifications ont été prises en compte";
				})
				.catch((err) => {
					this.infoProd = err;
					console.log(err);
				});
		},

		//* Want delete a product
		wantDelete: function(event, prod) {
			prod.delete = "red";
		},

		//* Delete product
		Delete: function(event, prod) {
			const id = prod.id;
			axios
				.delete(process.env.VUE_APP_API + "producer/delete/" + id)
				// headers: {
				// 	Authorization: `Bearer ${this.token}`,
				// },

				.then(() => {
					this.infoProd = "Le producteur a été supprimé.";
				})
				.catch((err) => {
					this.infoProd = err;
					console.log(err);
				});
		},
	},
};
</script>
<style scoped>
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
td,
input,
.valCreate {
	width: 200px;
}

.numb {
	width: 80px;
}
.photo {
	width: 120px;
}
table {
	border-collapse: collapse;
}
.create,
.valCreate {
	background-color: greenyellow;
}
#green {
	background-color: greenyellow;
}
#red {
	background-color: red;
	color: white;
}
.nocolor {
	background-color: white;
}
</style>
