<template>
	<div id="mentions">
		<h1>Mentions Légales</h1>
		<div id="contenu">
			<h2>Identité</h2>
			<h3>Propriétaire du site</h3>
			<p>
				Raison sociale : Monsieur Adrien Pichon<br />
				Forme juridique : Entrepreneur individuel <br />
				Montant du capital social : ?? <br />
				Numéro SIRET : 52872732400014 <br />
				Adresse : La Civraie Noyant 49490 Noyant-Villages <br />
				Adresse courrier électronique : adrienpichon<span class="pi pi-at"></span>live.fr
				<br />Téléphone : 06 14 10 04 47 <br />
				Numéro TVA intracommunautaire : FR57528727324
			</p>
			<h3>Développeur du site</h3>
			<p>
				Conception et réalisation : Delphine Moutault, delmout<span class="pi pi-at"></span
				>delmout.com<br />
				Animation : Delphine Moutault, delmout<span class="pi pi-at"></span>delmout.com
			</p>
			<h3>Hébergeur du site</h3>
			<p>
				Raison sociale : o2switch,<br />
				Forme juridique : SARL,<br />
				Numéro SIRET : 51090980700024<br />
				Adresse : 222-224 Boulevard Gustave Flaubert 63000 Clermont-Ferrand, <br />
				Téléphone. : 04 44 44 60 40<br />
			</p>
			<h2>Propriété intellectuelle</h2>
			<p>
				Sauf mention contraire, tous les éléments accessibles sur le site (textes, images,
				graphismes, logo, icônes, sons, logiciels, etc.) restent la propriété exclusive de
				leurs auteurs, en ce qui concerne les droits de propriété intellectuelle ou les
				droits d’usage. Toute reproduction, représentation, modification, publication,
				adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le
				procédé utilisé, est interdite, sauf autorisation écrite préalable de l’auteur.
				Toute exploitation non autorisée du site ou de l’un quelconque des éléments qu’il
				contient est considérée comme constitutive d’une contrefaçon et peut être poursuivie
				en justice. Les marques et logos reproduits sur le site sont déposés par les
				sociétés qui en sont propriétaires.
			</p>
			<h2>Liens</h2>
			<h3>Liens sortants</h3>
			<p>
				Le propriétaire du site décline toute responsabilité et n’est pas engagé par le
				référencement via des liens hypertextes, de ressources tierces présentes sur le
				réseau Internet, tant en ce qui concerne leur contenu que leur pertinence.
			</p>
			<h3>Liens entrants</h3>
			<p>
				Le propriétaire du site autorise les liens hypertextes vers l’une des pages de ce
				site, à condition que ceux-ci ouvrent une nouvelle fenêtre et soient présentés de
				manière non équivoque afin d’éviter :<br />
				– tout risque de confusion entre le site citant et le propriétaire du site<br />
				– ainsi que toute présentation tendancieuse, ou contraire aux lois en vigueur.
				<br />
				Le propriétaire du site se réserve le droit de demander la suppression d’un lien
				s’il estime que le site source ne respecte pas les règles ainsi définies.
			</p>
			<h2>Confidentialité</h2>
			<p>
				Tout utilisateur dispose d’un droit d’accès, de rectification et d’opposition aux
				données personnelles le concernant, en effectuant sa demande écrite et signée,
				accompagnée d’une preuve d’identité auprès du propriétaire du site.
			</p>
		</div>
	</div>
</template>
<script>
import { mapState } from "vuex";

export default {
	data() {
		return {};
	},
	computed: {
		...mapState(["inPages"]),
	},
	created: function() {
		this.$store.state.inPages = true;
	},
};
</script>
<style scoped>
#mentions {
	width: 80%;
	margin: auto;
}
#contenu {
	text-align: justify;
	line-height: 1.5rem;
}
h2 {
	color: yellow;
	margin-top: 3rem;
}
h3 {
	text-decoration: underline;
}
</style>
