<template>
	<div>
		<h1>Liste des utilisateurs</h1>
		<p>{{ infoProd }}</p>

		<table>
			<tr>
				<th class="sup"></th>
				<th>Nom</th>
				<th class="">Prénom</th>
				<th class="">Email</th>
				<th class="">Téléphone</th>
				<th class="">Date dernière connexion</th>
				<th>Commentaire</th>
			</tr>
			<tr v-for="us in users" :key="us.id" :id="us.delete">
				<td class="sup">
					<button
						v-if="!us.delete"
						style="background-color:red;color:white;"
						class="modif"
						type="button"
						@click="wantDelete($event, us)"
					>
						Sup
					</button>
					<button
						v-if="us.delete"
						style="background-color:white;color:red;"
						class="modif"
						type="button"
						@click="deleteUser($event, us)"
					>
						Supprimer cet utilisateur
					</button>
				</td>
				<td>
					<p>{{ us.nom }}</p>
				</td>
				<td>
					<p>{{ us.prenom }}</p>
				</td>
				<td>
					<p>{{ us.email }}</p>
				</td>
				<td>
					<p>{{ us.phone }}</p>
				</td>
				<td>
					<p>{{ dateFr(us.last_connect) }}</p>
				</td>

				<td class="comm" @click="modifComment($event, us)">
					<p style="white-space:pre-line;" v-if="!us.modif">{{ us.comment }}</p>
					<textarea
						v-if="us.modif && !us.delete"
						class="create comm "
						type="text"
						v-model="us.comment"
					/>
				</td>

				<td v-if="us.modif" id="validMod">
					<button
						v-if="us.modif && !us.delete"
						style="background-color:greenyellow;"
						class="modif"
						type="button"
						@click="validComment($event, us)"
					>
						Valider le commentaire
					</button>
				</td>
			</tr>
		</table>

		<p>Nombre utilisateurs = {{ length }}</p>
	</div>
</template>
<script>
import axios from "axios";
import moment from "moment";

export default {
	data() {
		return {
			infoProd: "",
			users: [],
			length: "",
			lengthPc: "",
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
		this.users = [];
	},
	created: function() {
		//* All users
		axios.get(process.env.VUE_APP_API + "user/allusers").then((user) => {
			this.length = user.data.length;
			for (let i = 0; i < this.length; i++) {
				this.users.push({
					id: user.data[i].id,
					nom: user.data[i].nom,
					prenom: user.data[i].prenom,
					email: user.data[i].email,
					phone: user.data[i].phone,
					last_connect: user.data[i].last_connect,
					comment: user.data[i].comment,
					modif: 0,
					delete: 0,
				});
				// sort by alpha order
				this.users.sort(function(a, b) {
					var nomA = a.nom.toUpperCase();
					var nomB = b.nom.toUpperCase();

					if (nomA < nomB) {
						return -1;
					}
					if (nomA > nomB) {
						return 1;
					}
					return 0;
				});
				console.log(this.users);
			}
		});
	},
	methods: {
		//* Want to modify a comment
		modifComment: function(event, us) {
			us.modif = true;
		},
		// //* Validation comment
		validComment: function(event, us) {
			const id = us.id;
			axios
				.put(process.env.VUE_APP_API + "user/comment/" + id, {
					comment: us.comment,
				})
				// headers: {
				// 	Authorization: `Bearer ${this.token}`,
				// },
				.then(() => {
					us.modif = false;
					this.infoProd = "Le commentaire a été modifié.";
				})
				.catch((err) => {
					this.infoProd = err;
					console.log(err);
				});
		},
		// //* Want delete a user
		wantDelete: function(event, us) {
			us.delete = "red";
		},
		// //* Delete user
		deleteUser: function(event, us) {
			const id = us.id;
			axios
				.delete(process.env.VUE_APP_API + "user/delete/" + id)
				// headers: {
				// 	Authorization: `Bearer ${this.token}`,
				// },
				.then(() => {
					this.infoProd = "Le compte utilisateur a été supprimé.";
				})
				.catch((err) => {
					this.infoProd = err;
					console.log(err);
				});
		},

		//* French format date
		dateFr: function(date) {
			return moment(date).format("DD/MM/YYYY");
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

.comm {
	width: 300px;
}
table {
	border-collapse: collapse;
}
#validMod {
	border: 0px solid;
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
.sup {
	border: 0px solid;
	width: 40px;
}
</style>
