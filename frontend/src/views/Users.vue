<template>
	<div id="usersTable">
		<div id="entete">
			<h3>Liste des utilisateurs</h3>
			<p id="number">Nombre utilisateurs = {{ length }}</p>
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
				><p>Le compte utilisateur a été supprimé.</p>
				<template #footer>
					<Button label="OK" @click="close" autofocus />
				</template>
			</Dialog>
		</div>

		<div id="tableau">
			<table>
				<tr>
					<th class="sup"></th>
					<th>Nom</th>
					<th class="">Prénom</th>
					<th class="">Email</th>
					<th class="">Téléphone</th>
					<th class="">Dernière connexion</th>
					<th>Commentaire</th>
				</tr>
				<tr v-for="us in users" :key="us.id" :id="us.delete">
					<td class="sup">
						<Button
							id="trash"
							icon="pi pi-trash"
							class=" p-button-rounded p-button-danger "
							@click="wantDelete($event, us)"
						/>
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
						<p id="comment" style="white-space:pre-line;" v-if="!us.modif">
							{{ us.comment }}
						</p>
						<Textarea
							v-if="us.modif && !us.delete"
							class="create comm "
							v-model="us.comment"
						/>
					</td>

					<td v-if="us.modif" id="validMod">
						<Button
							v-if="us.modif && !us.delete"
							style="background-color:rgb(252, 190, 76);color:black;border:none"
							icon="pi pi-check"
							class="p-button-rounded"
							@click="validComment($event, us)"
						/>
					</td>
				</tr>
			</table>
		</div>
	</div>
</template>
<script>
import axios from "axios";
import moment from "moment";
import { mapActions } from "vuex";

export default {
	data() {
		return {
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
			dialog: false,
		};
	},
	beforeMount: function() {
		this.$store.dispatch("checkConnect");
	},
	beforeCreate: function() {
		this.users = [];
	},
	created: function() {
		this.$store.state.inPages = true;
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
		...mapActions(["checkConnect"]),
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
				});
		},
		// //* Want delete a user
		wantDelete: function(event, us) {
			us.delete = "red";
			this.$confirm.require({
				target: event.currentTarget,
				message: "Souhaitez-vous supprimer ce compte utilisateur ?",
				icon: "pi pi-info-circle",
				acceptClass: "p-button-danger",
				accept: () => {
					this.deleteUser(event, us);
				},
				reject: () => {
					us.delete = 0;
				},
			});
		},
		//* Delete user
		deleteUser: function(event, us) {
			const id = us.id;
			axios
				.delete(process.env.VUE_APP_API + "user/delete/" + id)
				// headers: {
				// 	Authorization: `Bearer ${this.token}`,
				// },
				.then(() => {
					this.dialog = true;
				});
		},

		//* Close Dialog
		close: function() {
			this.dialog = false;
			location.reload();
		},

		//* French format date
		dateFr: function(date) {
			return moment(date).format("DD/MM/YYYY");
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
#entete {
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
#usersTable {
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
td,
input,
.valCreate {
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
.comm {
	width: 15vw;
}
table {
	border-collapse: collapse;
	margin: auto;
	margin-bottom: 2rem;
}
#validMod {
	border: 0px solid;
	background-color: #122f1c;
	width: 5vw;
}
.create,
.valCreate {
	background-color: rgb(252, 190, 76);
}
.create {
	font-size: 12px;
}
#comment {
	font-size: 12px;
	margin: 0;
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
.sup {
	border: 0px solid;
	width: 30px;
	background-color: #122f1c;
}
#trash {
	margin-right: 5px;
}
</style>
