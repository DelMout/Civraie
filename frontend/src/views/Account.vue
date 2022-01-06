<template>
	<div>
		<div>
			<h3>Compte de {{ firstname }} {{ name }}</h3>
			<p id="info">
				<i
					>Vous pouvez ici modifier les informations concernant votre téléphone ou
					supprimer votre compte.</i
				>
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
		<div class="telephone">
			<p>
				<label for="phone">Votre téléphone : </label>
				<InputText class="fill" id="phone" type="text" v-model="phone" />
			</p>
			<div>
				<Button
					label="Valider les modifications"
					class="p-button-raised p-button-primary "
					@click="modifPhone"
				/>
			</div>
		</div>
		<div class="telephone">
			<p id="prevention">
				<i
					><span id="exclam" class="pi pi-exclamation-triangle"></span>La suppression du
					compte engendrera la suppression des éventuelles commandes en cours. Aucune
					donnée vous concernant ne sera alors conservée. Plus d'informations dans
					<span>
						<a href="/mentions_legales" target="_blank"
							><i>Mentions Légales</i></a
						></span
					>.</i
				>
			</p>
			<div>
				<Button
					label="Supprimer votre compte"
					class="p-button-raised p-button-danger "
					@click="wantSuppress"
				/>
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
import { mapState, mapMutations, mapActions } from "vuex";

export default {
	data() {
		return {
			name: "",
			firstname: "",
			phone: "",
		};
	},
	computed: {
		...mapState(["token", "connected"]),
	},
	created: function() {
		//* Find datas of user from userId
		this.$store.dispatch("checkConnect");
		if (!this.connected) {
			this.$router.push("/");
		} else {
			axios({
				method: "get",
				url: process.env.VUE_APP_API + "user/getuser/" + localStorage.getItem("userId"),
				headers: {
					Authorization: `Bearer ${this.token}`,
				},
			}).then((user) => {
				this.name = user.data.nom;
				this.firstname = user.data.prenom;
				this.phone = user.data.phone;
			});
		}
	},
	methods: {
		...mapMutations(["setDeleted"]),
		...mapActions(["disconnect", "checkConnect"]),

		//* Modify users phone  number
		modifPhone: function() {
			this.$store.dispatch("checkConnect");
			if (!this.connected) {
				this.$router.push("/");
			} else {
				axios({
					method: "put",
					url:
						process.env.VUE_APP_API +
						"user/account/phone/" +
						localStorage.getItem("userId"),
					data: { phone: this.phone },
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				})
					.then(() => {
						this.$toast.add({
							severity: "success",
							detail: "Votre modification a bien été prise en compte.",
							closable: false,
							life: 4000,
						});
					})
					.catch(() => {
						this.$toast.add({
							severity: "error",
							detail: "Le numéro de téléphone n'est pas correctement saisi.",
							closable: false,
							life: 4000,
						});
					});
			}
		},
		//* Want delete the user account
		wantSuppress: function() {
			this.$confirm.require({
				target: event.currentTarget,
				message: "Souhaitez-vous supprimer votre compte utilisateur ?",
				icon: "pi pi-info-circle",
				acceptClass: "p-button-danger",
				accept: () => {
					this.suppress();
				},
				reject: () => {},
			});
		},

		//* Delete my user account
		suppress: function() {
			this.$store.dispatch("checkConnect");
			if (!this.connected) {
				this.$router.push("/");
			} else {
				axios({
					method: "delete",
					url:
						process.env.VUE_APP_API +
						"user/deletemyaccount/" +
						localStorage.getItem("userId"),
					headers: {
						Authorization: `Bearer ${this.token}`,
					},
				})
					.then(() => {
						localStorage.clear();
						this.$store.commit("setDeleted", true);
						this.$store.dispatch("disconnect");
						this.$router.push("/");
					})
					.catch(() => {
						this.$toast.add({
							severity: "error",
							detail: "Un problème est apparu. Votre compte n'a pu être supprimé.",
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
.telephone {
	display: flex;
	width: 40%;
	margin: auto;
	justify-content: space-between;
	border: 1px solid;
	padding: 0.2rem 1rem 0.2rem 1rem;
	margin-top: 2rem;
	align-items: center;
}
#prevention {
	width: 60%;
	text-align: justify;
}
#exclam {
	color: red;
	font-size: 1.8rem;
	margin-right: 6px;
}
#info {
	margin-top: 0;
}
h3 {
	margin-bottom: 0.5rem;
}
a {
	color: #4caf50;
}
/* MEDIA QUERIES */
@media only screen and (max-width: 1500px) {
	.telephone {
		width: 65%;
	}
	#prevention {
		margin-right: 2rem;
	}
}
@media only screen and (max-width: 768px) {
	/*mobiles et tablettes*/
	.telephone {
		width: 90%;
	}
}
@media only screen and (max-width: 576px) {
	.telephone {
		flex-direction: column;
	}
	#prevention {
		width: 100%;
		margin: auto;
		margin-top: 1rem;
		margin-bottom: 1rem;
	}
	button {
		margin-bottom: 1rem;
	}
}
</style>
