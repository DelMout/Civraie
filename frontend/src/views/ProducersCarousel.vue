<template>
	<div>
		<div id="conteneur">
			<Button icon="pi pi-chevron-left" class="buttgo p-button-rounded" @click="goLeft" />
			<div id="sousCont">
				<Card>
					<template #title>
						<p id="title"></p>
					</template>
					<template #subtitle> <p id="subtitle"></p></template>
					<template #content
						><p id="content"></p>
						<div><img alt="photo" src="{{image}}" /></div
					></template>
					<template #footer>
						<div>
							<table>
								<tr v-if="!noArticle">
									<th>
										Article
									</th>
									<th>
										Prix
									</th>
								</tr>
								<tr v-for="art in articles" :key="art.product">
									<td>{{ art.product }}</td>
									<td>{{ numFr(art.price) }} / {{ art.unite }}</td>
								</tr>
							</table>
						</div>
					</template>
				</Card>
			</div>
			<Button icon="pi pi-chevron-right" class="buttgo p-button-rounded" @click="goRight" />
		</div>
	</div>
</template>
<script>
import axios from "axios";

export default {
	data() {
		return {
			image: "../assets/ABlogo.png",
			indice: 0,
			noArticle: false,
			articles: [],
			producers: [
				{
					name: "Ferme de La Civraie",
					city: "49 - Noyant",
					text:
						"Adrien et Céline Pichon vous accueille sur la Ferme de la Civraie. Producteurs depuis	le 1<sup>er</sup> novembre 2010, nous produisons sur la ferme du lait de vaches de race mixte et des œufs de poules pondeuses plein air. Ayant créé l’atelier vente directe en 2013, nous aimons le contact avec les clients, rencontrer de nouvelles personnes et répondre au mieux à leurs besoins. Nous avons créé le magasin Civraie, Si Frais en septembre 2020. Nous sommes maintenant près de 20 producteurs réunis à la ferme !!<br/>Pour le lait cru, apportez vos bouteilles, nous vendons le lait en vrac.",
					array: "civraie",
				},
				{
					name: "SCEA La Bécassière",
					city: "49 - Dénezé-sous-le-Lude",
					text:
						"Éleveurs de lapins depuis 1992, c‘est en 2011 que Jean-Pierre et Sylvie Duval ont décidé de se consacrer à la transformation et la vente directe. Les 90 mères donnent naissances à des lapereaux qu’ils engraissent sur une période de 13 à 19 semaines avec un aliment lapin (à base de luzerne, betterave, céréales, vitamines et minéraux) sans antibiotique, ni OGM. Si besoin les lapins sont soignés avec des huiles essentielles (Cannelle , Eucalyptus , Giroflier , Lemon grass , Origan).",
					array: "becassiere",
				},
				{
					name: "La Clémencière",
					city: "49 - Le Guédéniau",
					text:
						"La Clémencière se situe au Guédéniau commune déléguée de Baugé-en-Anjou entouré de la Forêt de Chandelais. La ferme de Mélanie et Anthony est une petite exploitation de 20 ha. Ils produisent du canard gras, gavé selon une méthode traditionnelle au maïs grain entier et un petit cheptel d’Aubrac vaches allaitantes.",
					array: "clemenciere",
				},
				{
					name: "L'Autruche Gauloise",
					city: "72 - Aubigné Racan",
					text:
						"Petit élevage d’autruches de proximité situé en Sarthe (mais originaire d’Indre-et-Loire) nommé \"L’Autruche Gauloise\" nous sommes un élevage naisseur-engraisseur. Les animaux sont élevés en plein air, nourris avec les céréales (maïs, blé, pois, orge et luzerne déshydratés), des producteurs à partir de leurs 6 mois et ils sont abattus à l’âge de 18 mois environ. Cette viande rouge tendre, peu calorique, pauvre en cholestérol et très bonne source de protéines se retrouvera sous forme de steak, tournedos, rôtis, etc. Elle sera vendue en surgelé (n’oubliez pas votre sac isotherme !). Les producteurs ont choisi ce type de conservation car la surgélation respecte mieux la texture, la saveur et les valeurs nutritives des aliments qu’une simple congélation Ce qui permettra aux consommateurs de conserver sa viande pour de meilleures occasions tout en gardant toutes les qualités nutritives qu'apporte la viande d'autruche.",
					array: "autruche",
				},
				{
					name: "EARL Vilguenais",
					city: "49 - Vieil-Baugé",
					text:
						"Tous les porcs sont nés et élevés sur la ferme. Ils grandissent dans la paille et sont nourris avec les céréales produites sur l’exploitation de la famille Guiloiseau.",
					array: "vilguenais",
				},
				{
					name: "Le fromage du Frêne",
					city: "72 - Le Lude",
					text:
						"Ferme familiale depuis 5 générations, située au Lude sur le bord du Loir, il y est produit du fromages et des laitages au lait cru de vache. Multiples saveurs grâce aux prairies permanentes à la flore très variée des zones humides. Ketty, Cécile, Joël et Lucie ont le plaisir de produire en agriculture biologique avec un troupeau de 30 vaches de races mixtes.",
					image: "src='../assets/ABlogo.png'	alt='logo agriculture biologique'",
				},
				{
					name: "Les légumes du Frêne",
					city: "72 - Le Lude",
					text:
						"Maxime, maraicher sur 1 hectare de la ferme fromagère du Frêne, produit des légumes diversifiés de saisons le tout en agriculture biologique. Les légumes sont à commander le mercredi soir au plus tard pour un arrivage à la ferme de la Civraie le vendredi.",
					array: "frene_legumes",
				},
				{
					name: "La Cabrett' du Viornay",
					city: "37 - Marcilly-sur-Maulnes",
					text:
						"<p>Petite exploitation à la limite du Maine-et-Loire, La Cabrett’ du Viornay élève de belles chèvres alpines. Ces dernières pâturent autour de la ferme afin de donner un lait de qualité. Le fromage est livré toutes les semaines à la Ferme de la Civraie.</p><p>Pour vos commandes, pensez à réserver le dimanche soir pour une livraison le vendredi suivant.</p>",
					array: "cabrett",
				},
				{
					name: "Ferme Bio du Point du Jour",
					city: "49 - Jarzé",
					text:
						"La ferme Bio du Point du Jour vous propose une gamme de pâtes semi-complète fabriquées à la ferme avec leurs propres céréales. Les céréales sont cultivées en agriculture biologiques, récoltées, stockées et transformées chez eux dans leur atelier.",
					array: "jarze",
				},
				{
					name: "Les Escargots de Mouliherne",
					city: "49 - Mouliherne",
					text:
						"Les escargots sont élevés de manière naturelle en plein air dans la campagne de Mouliherne par Arnaud et Nathalie Le Nud.",
					array: "escargots",
				},
				{
					name: "Le Moulin Hubeau",
					city: "49 - Baugé-en-Anjou",
					text:
						"Truites élevées à Baugé-en-Anjou, Guillaume et Anne vous propose des produits de qualité.",
					array: "hubeau",
				},
				{
					name: "EARL La Joulinière",
					city: "37 - Savigné-sur-Lathan",
					text:
						"Jean-Noël Porteboeuf vous propose une gamme de céréales et d’asperges produites sur son exploitation.",
					array: "jouliniere",
				},
				{
					name: "De la graine à l'huile",
					city: "49 - Beaufort-en-Vallée",
					text:
						"Jeune agriculteur installé depuis 2017 agriculture biologique, Benoît cultive du colza et tournesol. Les graines qu’il récolte sont séchées, triées, pressées, filtrées afin d'extraire l'huile. La mise en bouteille est également effectuée par ses soins. Tout est réalisé sur l'exploitation d'où le nom \"De la graine à l'huile\".",
					array: "huile",
				},
				{
					name: "L'Or de la Ruche",
					city: "49 - Saint-Martin-d'Arcé",
					text:
						'Apicultrice professionnelle installée sur Baugé-en-Anjou. Anne vous propose une gamme de miels provenant que du territoire du Baugeois (20km autour de Baugé). Son choix est de respecter ses abeilles et leur environnement. Elle essaie d\'appliquer ce slogan "BON - PROPRE - JUSTE".<br/>* <u>La Miellée Gourmande</u> : Mélangeant de façon harmonieuse le goût légèrement confit de l’oignon et la délicatesse des fleurs de forêt, cette miellée saura satisfaire aussi bien les gourmands que les cordons bleus.<br/>* <u>La Miellée du Baugeois</u> : Cette Miellée, avec ses saveurs de châtaigniers, saura vous emmener en balade dans le Baugeois. Nous la récoltons courant juillet, elle vous offre une palette riche de marrons mais la couleur ambre est souvent prépondérante.<br/>* <u>La Miellée de la Forêt</u> : La particularité de cette miellée réside dans son mélange de nectars et de miellats variés. La difficulté de cette miellée vient du fait qu’elle s’opère à n’importe quel moment de l’été. Il faut donc, en fonction des ruchers, surveiller ce que peuvent rentrer les abeilles.<br/>* <u>La Miellée du Soleil</u> : Vous trouverez dans la miellée du printemps un mélange de fleurs en fonction des différents ruchers : les pommiers en fleurs, les cerisiers, les cassis, les trèfles, les pissenlits et le colza.<br/>* <u>La Miellée des Saveurs</u> : Cette miellée est la dernière de la saison apicole. Les abeilles vont sur l’ensemble des fleurs d’été chercher leurs nectars pour en faire ce miel subtil qui saura éveiller vos papilles. Son goût, légèrement fruité, avec différentes saveurs, devrait agrémenter avec douceur vos tartines, tisanes et thés.',
					array: "ruche",
				},
				{
					name: "Berthe et Perrin Confiseurs",
					city: "49 - Vernoil-le-Fourrier",
					text:
						"Artisans confiturier, chocolatier, biscuitier et glacier, Emmanuel et Laurence vous propose une large gamme de petits plaisirs élaborés à partir de produits frais de qualité et de recettes savoureuses. Leurs douceurs sont réalisées artisanalement dans leur laboratoire sans utilisation de conservateur, en privilégiant les approvisionnements et la vente par circuits courts.",
					array: "confiseurs",
				},
				{
					name: "Les Kiwis de Varennes",
					city: "49 - Varennes-sur-Loire",
					text:
						"Après avoir longtemps cultivé des petits fruits, Ghislaine s'est lancée dans la culture de kiwis avec l'aide de son mari Pierre, à côté de la ferme arboricole familiale. Les kiwis sont produits sans traitements chimiques de synthèse. Ferme arboricole produisant des pommes pour une coopérative et des kiwis en vente directe. Les engagements du producteur : kiwis cultivés en agriculture raisonnée sans produits chimiques de synthèse. Les kiwis sont récoltés à partir de fin novembre.",
					array: "kiwis",
				},
				{
					name: "Les Vergers de la Croix de Pierre",
					city: "49 - Méon",
					text:
						"Les Vergers de La Croix de Pierre est une entreprise familiale depuis trois générations. En harmonie avec la nature et les exigences des consommateurs, nous produisons une large gamme de pommes de table conventionnelles et BIO ainsi que le jus de pomme.",
					array: "vergers",
				},
				{
					name: "Vignoble le Gros Caillou",
					city: "37 - Saint-Nicolas-de-Bourgueil",
					text:
						"Patrice a découvert le métier de viticulteur dès sa plus tendre enfance grâce à ses parents, des personnes passionnées par leur profession. Il est très vite tombé amoureux de la vigne et du vin. Et depuis, grâce aux conseils avisés de ses parents, il est devenu à son tour viticulteur. Son domaine familial depuis trois générations se situe au cœur de l’appellation Saint-Nicolas-de-Bourgueil. Il s’étend sur 18 hectares, 16 hectares en Saint-Nicolas-de-Bourgueil et 2 hectares en Bourgueil. Il produit essentiellement du vin rouge, des cuvées «Tradition », « Vieilles Vignes » et «en fût de chêne ». Ses vins sont légers, souples et fruités de cépage 100% cabernet franc. Ils se marient très bien avec tous les mets. Depuis 2020, son exploitation est devenue HVE* (Haute Valeur Environnementale).",
					array: "vignoble",
				},
				{
					name: "GAEC de Bré",
					city: "37 - Channay-sur-Lathan",
					text:
						"Sébastien et Mélanie HUET, nous propose un produit riche en qualité, La Spiruline. Cette micro algue est produite chez eux dans 200m² de bassin chauffés grâce à leur élevage de vaches laitières et leur méthaniseur. La spiruline est récoltée, selon la météo, tous les jours ou tous les deux jours. C’est un complément alimentaire très riche. Effectivement, elle est composée à 70% de protéines. Elle pèse également son pesant de fer : 10g soit 25% des besoins journaliers dans cet élément essentiel. Conditionnée en sachet hermétique et à l’abris de la lumière, la spiruline se conserve des années.",
					array: "bre",
				},
				{
					name: "Atelier de Mamour Kymaey",
					city: "49 - Noyant",
					text:
						"Passionnée de couture, Laure vous propose une gamme de produits nous aidant à devenir plus responsable de nos déchets. Vous aimerez ces couleurs pep’s, attirantes, modernes. <br/>Actuellement en congé maternité, notre maman couturière reviendra très vite avec ses produits !! Ils seront disponibles à partir de fin janvier 2021 au magasin Civraie, Si Frais.",
					array: "mamour",
				},
			],
		};
	},

	mounted: function() {
		//* Get items from a producer
		this.getItems();

		let title = document.getElementById("title");
		title.innerHTML = this.producers[this.indice].name;
		let subtitle = document.getElementById("subtitle");
		subtitle.innerHTML = this.producers[this.indice].city;
		let content = document.getElementById("content");
		content.innerHTML = this.producers[this.indice].text;
		// let image = document.getElementById("image");
		// image.innerHTML = this.producers[this.indice].image;
	},
	created: function() {
		this.$store.state.inPages = true;
	},

	methods: {
		//* Number format
		numFr: function(num) {
			return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
				num
			);
		},

		//* Show a new producer from the right
		goRight: function() {
			if (this.indice < 19) {
				this.indice++;
			}
			let title = document.getElementById("title");
			title.innerHTML = this.producers[this.indice].name;
			let subtitle = document.getElementById("subtitle");
			subtitle.innerHTML = this.producers[this.indice].city;
			let content = document.getElementById("content");
			content.innerHTML = this.producers[this.indice].text;
			// let image = document.getElementById("image");
			// image.innerHTML = this.producers[this.indice].image;
			this.getItems();
		},

		//* Show a new producer from the right
		goLeft: function() {
			if (this.indice > 0) {
				this.indice--;
			}
			let title = document.getElementById("title");
			title.innerHTML = this.producers[this.indice].name;
			let subtitle = document.getElementById("subtitle");
			subtitle.innerHTML = this.producers[this.indice].city;
			let content = document.getElementById("content");
			content.innerHTML = this.producers[this.indice].text;
			let image = document.getElementById("image");
			image.innerHTML = this.producers[this.indice].image;
			this.getItems();
		},

		//* Get all items from a producer
		// Get id of producer
		getItems: function() {
			this.articles = [];
			this.noArticle = true;
			axios
				.get(
					process.env.VUE_APP_API +
						"producer/getproducerid/" +
						this.producers[this.indice].name
				)
				.then((produ) => {
					console.log(produ.data.id);
					// Get list of products from producerId
					axios
						.get(process.env.VUE_APP_API + "product/producerid/" + produ.data.id)
						.then((prod) => {
							if (prod.data.length == 0) {
								this.noArticle = true;
							} else {
								this.noArticle = false;
							}
							for (let i = 0; i < prod.data.length; i++) {
								this.articles.push({
									product: prod.data[i].product,
									price: prod.data[i].price,
									unite: prod.data[i].unite_vente,
								});
							}
						});
				});
		},
	},
};
</script>
<style scoped>
@font-face {
	font-family: "RougeScript";
	src: url("../assets/RougeScript-Regular.ttf") format("truetype");
}
@font-face {
	font-family: "Aguafina";
	src: url("../assets/AguafinaScript-Regular.ttf") format("truetype");
}
@font-face {
	font-family: "dancing";
	src: url("../assets/dancingscript-regular-webfont.ttf") format("truetype");
}
@font-face {
	font-family: "caveat";
	src: url("../assets/caveat-regular.ttf") format("truetype");
}
#conteneur {
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	margin: auto;
	padding-right: auto;
	padding-left: auto;
	width: 95%;
}
#sousCont {
	width: 70%;
	display: flex;
	justify-content: center;
	margin-bottom: 1rem;
}
::v-deep(.p-card) {
	box-shadow: 8px 8px 8px white;
	margin: 0;
	padding: 0;
	display: flex;
	flex-direction: column;
	border-radius: 15px;
	width: 100%;
	background-image: url("../assets/grassWhite.jpg");
}

::v-deep(.p-card-footer) {
	width: 40%;
	margin: auto;
	margin-top: 2rem;
}
::v-deep(.p-card-title) {
	margin-top: 1rem;
}
.buttgo {
	/* width: 4rem; */
	background-color: white;
	color: green;
}

#title {
	padding-bottom: 0;
	font-family: "dancing";
	font-size: 1.8rem;
}
#subtitle {
	font-size: 1.5rem;
	font-family: "caveat";
}
#content {
	text-align: justify;
	width: 80%;
	margin: auto;
	margin-top: 2rem;
	font-family: "caveat";
	font-size: 1.3rem;
}
p {
	margin: 0;
}
table {
	margin: auto;
	border-collapse: collapse;
	margin-bottom: 2rem;
	font-family: "caveat";
	font-size: 1.3rem;
}
td,
th {
	border: 1px solid #122f1c;
}
tr {
	height: 2rem;
}
td {
	text-align: left;
	padding-left: 0.5rem;
	padding-right: 0.5rem;
}
</style>
