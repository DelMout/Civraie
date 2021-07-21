const { order } = require("../models");
const { user } = require("../models");
const { date } = require("../models");
const fs = require("fs");
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");

// * Create a new order
exports.createOrder = (req, res) => {
	const newOrder = new order({
		...req.body,
		userId: req.params.userid,
		dateId: req.params.dateid,
	});
	newOrder
		.save()
		.then((order) => {
			res.send(order);
		})
		.catch((err) => {
			res.status(401).send(err);
			// res.status(401).send(err.errors[0].validatorKey);
		});
};

// * Get orders according to delivery date (dateId)
exports.getAllOrders = (req, res) => {
	order
		.findAll({
			where: { dateid: req.params.dateid },
		})
		.then((obj) => {
			res.send(obj);
		});
};

// * Get orders according to delivery date (dateId) and sorted by user
exports.getOrdersByUser = (req, res) => {
	order
		.findAll({
			where: { dateid: req.params.dateid },
			order: [["userid", "ASC"]],
		})
		.then((obj) => {
			res.send(obj);
		});
};

// * Get orders according to delivery date (dateId) and sorted by product
exports.getOrdersByProd = (req, res) => {
	order
		.findAll({
			where: { dateid: req.params.dateid },
			order: [["productid", "ASC"]],
		})
		.then((obj) => {
			res.send(obj);
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
	//TODO Remplacer localhost:8080 par adresse site en ligne !!
	user.findOne({ where: { id: req.params.userid } })
		.then((user) => {
			const email = user.email;
			const prenom = user.prenom;
			const nom = user.nom;

			// Recherche datas of date (delivery date)
			date.findOne({ where: { id: req.params.dateid } })
				.then((date) => {
					const deliverydate = date.delivery_date;

					// Recherche datas of order (all lines)
					order
						.findAndCountAll({
							where: {
								[Op.and]: [
									{ userId: req.params.userid },
									{ dateId: req.params.dateid },
								],
							},
						})
						.then((orders) => {
							const count = orders.count; //! A modifier (boucle)

							const titre = "[La Civraie] Confirmation de votre commande";
							const message =
								"<p>Votre commande sera livrée au magasin de la ferme de La Civraie le " +
								deliverydate +
								".</p>";
							transporter.sendMail(
								{
									from: "Le magasin de la ferme de la Civraie <lacivraie@delmout.com>",
									to: email,
									subject: titre,
									html:
										"<p>Bonjour " +
										prenom +
										" " +
										nom +
										",</p></br>" +
										message +
										"</br><p>Votre commande contient " +
										count +
										" lignes.</p></br></br><p>Merci de ne pas répondre à cet email.</p><p>A bientôt au magasin de la ferme de la Civraie.</p><p>L'équipe de la Civraie</p>",
								},
								(error, info) => {
									if (error) {
										return res.status(401).send(error);
									}
									res.status(200).send("email envoyé !");
								}
							);
							// res.status(200).send(prenom);
						})
						.catch((err) => res.status(401).send(err));
				})
				.catch((err) => res.status(401).send(err));
		})
		.catch((err) => res.status(401).send(err));
	// .catch((err) => res.status(401).send("bad request"));
};
