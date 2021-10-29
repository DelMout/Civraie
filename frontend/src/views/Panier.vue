<template>
	<div>
		<!-- Table pour le panier de commande -->
		<table v-if="total > 0">
			<caption>
				Votre commande
			</caption>
			<tr>
				<th>Produit</th>
				<th>Quantité</th>
				<th>Unité</th>
				<th>Prix</th>
			</tr>
			<tr v-for="prod in products" :key="prod.id">
				<td v-if="prod.qty > 0">{{ prod.product }}</td>
				<td v-if="prod.qty > 0">{{ prod.qty }} x</td>
				<td v-if="prod.qty > 0">{{ prod.unite_vente }}</td>
				<td v-if="prod.qty > 0">{{ numFr(prod.qty * prod.price_unite_vente) }}</td>
			</tr>

			<td colspan="4">
				Prix total de la commande : <span>{{ numFr(total) }} </span
				><button class="addsub" type="button" @click="validOrder">
					Valider la commande
				</button>
			</td>
		</table>
	</div>
</template>
