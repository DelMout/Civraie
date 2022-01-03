<template>
	<div>
		<div>
			<h4>Compte de</h4>
			<p id="info">
				<i
					>Vous pouvez ici modifier les informations concernant votre téléphone ou
					supprimer votre compte.</i
				>
			</p>
		</div>
		<div class="telephone">
			<p class="">
				<label for="phone">Votre téléphone : </label>
				<InputText class="fill" id="phone" type="text" v-model="phone" />
			</p>
			<div>
				<Button
					label="Valider les modifications"
					class="p-button-raised p-button-primary login"
					@click="modif"
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
						<a href="https://www.delmout.com" target="_blank"
							><i>Mentions Légales</i></a
						></span
					>.</i
				>
			</p>
			<div>
				<Button
					label="Supprimer votre compte"
					class="p-button-raised p-button-danger "
					@click="suppress"
				/>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {};
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
h4 {
	margin-bottom: 0.5rem;
}
</style>
