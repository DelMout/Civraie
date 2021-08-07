<template>
	<div id="nav">
		<router-link to="/">Accueil</router-link> |
		<router-link to="/produits_vente_magasin">Produits à la vente</router-link> |
		<router-link to="/produits_vente_commande">Produits à la commande</router-link> |
		<router-link to="/tous_produits">* Liste Produits *</router-link> |
		<router-link to="/producteurs">* Liste Producteurs *</router-link> |
		<router-link to="/utilisateurs">* Liste Utilisateurs *</router-link> |
	</div>
	<router-view />
</template>
scrip

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

#nav {
	padding: 30px;
}

a {
	text-decoration: none;
	color: #999;
}

a.router-link-exact-active {
	color: rgb(11, 112, 11);
	font-weight: 600;
}
</style>
