const { order } = require("../models");
const { user } = require("../models");
const { information } = require("../models");
const nodemailer = require("nodemailer");
const path = require("path");
const { Op } = require("sequelize");

// * Create a new order
exports.createOrder = (req, res) => {
	const newOrder = new order({
		...req.body,
		userId: req.params.userid,
		delivery_date: req.params.delivery_date,
	});
	newOrder
		.save()
		.then((order) => {
			res.send(order);
		})
		.catch((err) => {
			res.status(401).send(err);
		});
};

// * Get orders according to delivery date (delivery_date) and if snails products (escarg)
exports.getAllOrders = (req, res) => {
	order
		.findAll({
			where: {
				[Op.and]: [
					{ delivery_date: req.params.delivery_date },
					{ escarg: req.params.escarg },
				],
			},
		})
		.then((obj) => {
			res.send(obj);
		})
		.catch((err) => {
			res.status(401).send(err);
		});
};

// * Send an email for order confirmation
exports.emailConfirm = (req, res) => {
	let transporter = nodemailer.createTransport({
		host: "source.o2switch.net",
		port: 465,
		secure: true, // true for 465, false for other ports
		tls: {
			rejectUnauthorized: false,
		},
		auth: {
			user: process.env.FROM_EMAIL,
			pass: process.env.PASS_EMAIL,
		},
	});
	// Recherche  datas du user
	user.findOne({ where: { id: req.params.userid } })
		.then((user) => {
			information
				.findOne({
					where: { item: "open_hours" },
				})
				.then((info) => {
					const openhours = info.content;

					const email = user.email;
					const prenom = user.prenom;
					const nom = user.nom;

					const titre = "[La Civraie] Confirmation de votre commande";
					const message =
						"<p>Vous trouverez ci-dessous le détail de votre commande.<br/>Livraison à la ferme de la Civraie.</p>";
					const contenu = req.params.contenu;
					transporter.sendMail(
						{
							from: "Magasin Civraie Si Frais <lacivraie@delmout.com>",
							to: email,
							subject: titre,
							html:
								"<p>Bonjour " +
								prenom +
								" " +
								nom +
								",</p>" +
								message +
								"<p>Le contenu de votre commande :</br><table style='border-collapse: collapse;'><tr><th style='border: 1px solid black;width:150px;height:40px;'>Produit</th><th style='border: 1px solid black;width:80px;height:40px;'>Quantité</th><th style='border: 1px solid black;width:80px;height:40px;'>Unité</th><th style='border: 1px solid black;width:200px;height:40px;'>Jour livraison</th></tr>" +
								contenu +
								"</table></p></br></br><p>Merci de ne pas répondre à cet email.</p><p>A bientôt au magasin Civraie, Si Frais.</p><p style='margin:0'>Adrien et Céline Pichon</p><a href='mailto:adrienpichon@live.fr'>adrienpichon@live.fr</a><p style='color:green;font-weight:bold;margin:0;'>Ferme de la Civraie</p><p style='color:green;font-weight:bold;margin:0'>Magasin Civraie, Si Frais</p>" +
								openhours +
								"<p style='margin:0'>La Civraie</p><p style='margin:0'>Noyant</p><p style='margin:0'>49490 Noyant-Villages</p><p style='margin:0'>Tél. : 06 14 10 04 47</p><img style='width:200px;margin-top:10px' src='cid:logo@civraie.com'/>",
							attachments: [
								{
									filename: "magasin_civraie.png",
									path: path.join(__dirname, "../images/magasin_civraie.png"),
									cid: "logo@civraie.com",
									contentDisposition: "inline",
								},
							],
						},
						(error, info) => {
							if (error) {
								return res.status(401).send(error);
							}
							res.status(200).send("email envoyé !");
						}
					);
				})
				.catch((err) => res.status(401).send(err));
		})

		.catch((err) => res.status(401).send(err));
};
