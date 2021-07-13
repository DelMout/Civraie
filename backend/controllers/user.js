const { user } = require("../models");
const { date } = require("../models");
const { information } = require("../models");
// const { publication } = require("../models");
const fs = require("fs"); // handle files
const bcrypt = require("bcrypt"); // crypt password
const jwt = require("jsonwebtoken"); // create token key
const passwordValidator = require("password-validator");
const schemaPassword = new passwordValidator();
const nodemailer = require("nodemailer");
const { resolve } = require("path");

//* Schema Password
schemaPassword.is().min(10).has().uppercase().has().lowercase().has().digits();

//! * Create a new user
exports.signup = (req, res) => {
	if (!schemaPassword.validate(req.body.password)) {
		return res
			.status(401)
			.send(
				"password not enough strong, missing :" +
					schemaPassword.validate(req.body.password, { list: true })
			);
	} else {
		// create 'jeton' for link when user forgot password
		const characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		let jeton = "";
		for (let i = 0; i < 25; i++) {
			jeton += characters[Math.floor(Math.random() * characters.length)];
		}
		const newUser = new user({
			...req.body,
			password: bcrypt.hashSync(req.body.password, 10),
			last_connect: Date(),
			jeton: jeton,
		});
		newUser
			.save()
			.then((user) => {
				let token = jwt.sign(
					{ userId: user.id, isAdmin: user.isAdmin },
					process.env.JWT_KEY,
					{
						expiresIn: "1h",
					}
				);
				res.json({
					userId: user.id,
					token: token,
					isAdmin: user.isAdmin,
				});
			})
			.catch((err) => {
				res.status(401).send(err);
			});
	}
};

//! * Login
exports.login = (req, res) => {
	const email_saisi = req.body.email;
	const password_saisi = req.body.password;
	user.findOne({ where: { email: email_saisi } })
		.then((user) => {
			const password = user.password;
			if (bcrypt.compareSync(password_saisi, password)) {
				let token = jwt.sign(
					{ userId: user.id, isAdmin: user.isAdmin },
					process.env.JWT_KEY,
					{
						expiresIn: "1h",
					}
				);
				res.json({
					userId: user.id,
					token: token,
					isAdmin: user.isAdmin,
				});
			} else {
				res.status(401).send("Password not OK");
			}
		})
		.catch((err) => {
			res.status(401).send("Email not OK");
		});
};

//! * Update connexion date and jeton (used when user forgot password)
exports.lastconn = (req, res) => {
	const characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let jeton = "";
	for (let i = 0; i < 25; i++) {
		jeton += characters[Math.floor(Math.random() * characters.length)];
	}
	user.update(
		{
			last_connect: Date(),
			jeton: jeton,
		},
		{ where: { id: req.params.userid } }
	)
		.then(() => {
			res.send("user modified !");
		})
		.catch((err) => {
			res.status(401).send(err);
			// res.status(401).send(err.errors[0].validatorKey);
		});
};

//! * Get all users
exports.getAllUsers = (req, res) => {
	user.findAll({
		order: [["last_connect", "ASC"]],
	}).then((obj) => {
		res.send(obj);
	});
};

//! * Update comment
exports.comment = (req, res) => {
	user.update(
		{
			comment: req.body.comment,
		},
		{ where: { id: req.params.userid } }
	)
		.then(() => {
			res.send("comment updated !");
		})
		.catch((err) => {
			res.status(401).send(err);
			// res.status(401).send(err.errors[0].validatorKey);
		});
};

//! * Modif password
exports.updatePassword = (req, res) => {
	if (!schemaPassword.validate(req.body.password)) {
		return res.status(401).send(schemaPassword.validate(req.body.password, { list: true }));
	} else {
		user.update(
			{
				password: bcrypt.hashSync(req.body.password, 10),
			},
			{ where: { id: req.params.userid } }
		)
			.then(() => {
				res.send("password modified");
			})
			.catch((err) => {
				res.status(401).send(err);
			});
	}
};

//! * Delete user
exports.delete = (req, res) => {
	// user.findOne({ where: { id: req.params.userid } })
	// .then((resp) => {
	user.destroy({ where: { id: req.params.userid } })
		.then(() => {
			res.send("user deleted");
		})
		.catch((err) => {
			res.send(err);
		});
	// })
	// .catch((err) => res.status(500).json({ err }));
};

//! * Find user from jeton
exports.jeton = (req, res) => {
	user.findOne({ where: { jeton: req.params.jeton } })
		.then((resp) => {
			res.status(200).send(resp);
		})
		.catch((err) => {
			res.status(401).send(err);
		});
};

//! * Send an email for password forgotten
exports.emailPassword = (req, res) => {
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
	// Recherche  jeton
	//TODO Remplacer localhost:8080 par adresse site en ligne !!
	user.findOne({ where: { email: req.params.email } })
		.then((user) => {
			const jeton = user.jeton;
			const email = req.params.email;
			const prenom = user.prenom;
			const nom = user.nom;
			const titre = "[La Civraie] Demande d'initialisation mot de passe";
			const message =
				"<p>Merci de cliquer sur le lien pour saisir un nouveau mot de passe.</p>";
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
						"</br><a href='http://localhost:8080/setpassword/" +
						jeton +
						"'>Saisir un nouveau mot de passe</a></br></br><p>Merci de ne pas répondre à cet email.</p><p>A bientôt au magasin de la ferme de la Civraie.</p><p>L'équipe de la Civraie</p>",
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
	// .catch((err) => res.status(401).send("bad request"));
};

//! * Send an email to all users for ordering
exports.emailOrder = (req, res) => {
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
	//TODO Remplacer les 2 dates en faisant un get dans tableau "dates"
	// List of users non isAdmin
	user.findAndCountAll({ where: { isAdmin: 0 } })
		.then((users) => {
			// res.send(users);
			const count = users.count;
			for (let i = 0; i < count; i++) {
				// Message for each user
				transporter.sendMail(
					{
						from: "Le magasin de la ferme de la Civraie <lacivraie@delmout.com>",
						to: users.rows[i].email,
						subject: "[La Civraie] A vos commandes !",
						html:
							"<p>Bonjour " +
							users.rows[i].prenom +
							" " +
							users.rows[i].nom +
							",</p></br><p>Vous pouvez dès à présent créer une commande sur notre site. Vous avez jusqu'au 22/07/2021 pour saisir votre commande. Les produits seront ensuite livrés au magasin le 26/07/2021.</p></br><p>Par ici pour votre commande !</p><a href='http://localhost:8080>Le magasin de La Civraie'</a></br></br><p>Merci de ne pas répondre à cet email.</p><p>A bientôt au magasin de la ferme de la Civraie.</p>",
					},
					(error, info) => {
						if (error) {
							return res.status(401).send(error);
						}
						res.status(200).send("email envoyé !");
					}
				);
			}
		})
		.catch((err) => res.status(401).send("bad request"));
};
//! * Send an email to all users for specific information
exports.emailInfo = (req, res) => {
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

	// Title and content of specific email
	information
		.update(
			{
				title: req.body.title,
				content: req.body.content,
			},
			{ where: { item: "specific_email" } }
		)
		.then(() => {
			// information.findOne({ where: { item: "specific_email" } }).then((specific) => {
			// 	const title = specific.title;
			// 	const content = specific.content;

			// List of users non isAdmin
			user.findAndCountAll({ where: { isAdmin: 0 } })
				.then((users) => {
					// res.send(users);
					const count = users.count;
					for (let i = 0; i < count; i++) {
						// Message for each user
						transporter.sendMail(
							{
								from: "Le magasin de la ferme de la Civraie <lacivraie@delmout.com>",
								to: users.rows[i].email,
								subject: "[La Civraie]" + req.body.title,
								html:
									req.body.content +
									"</br><a href='http://localhost:8080'>Le magasin de La Civraie</a></br></br><p>Merci de ne pas répondre à cet email.</p><p>A bientôt au magasin de la ferme de la Civraie.</p>",
							},
							(error, info) => {
								if (error) {
									return res.status(401).send(error);
								}
								res.status(200).send("email envoyé !");
							}
						);
					}
				})
				.catch((err) => res.status(401).send("bad request"));
		});
};

//* Send an email to user's publication when new comment
// exports.emailCom = (req, res) => {
// 	let transporter = nodemailer.createTransport({
// 		host: "source.o2switch.net",
// 		port: 465,
// 		secure: true, // true for 465, false for other ports
// 		tls: {
// 			rejectUnauthorized: false,
// 		},
// 		auth: {
// 			user: process.env.FROM_EMAIL,
// 			pass: process.env.PASS_EMAIL,
// 		},
// 	});
// Who wrote publication
// 	publication.findOne({ where: { id: req.params.pubid } }).then((pub) => {
// 		const userId = pub.userId;
// 		const titre = pub.titre;
// 		user.findOne({ where: { id: userId } })
// 			.then((userPub) => {
// 				const choiceCom = userPub.emailCom;
// 				const email = userPub.email;
// 				const prenom = userPub.prenom;
// 				if (choiceCom === 1) {
// 					// Message for the user's publication
// 					transporter.sendMail(
// 						{
// 							from: "DelphAdmin du Réso Mouto <reso.mouto@delmout.com>",
// 							to: email,
// 							subject: "[Réso' Mouto'] Ta publication a reçu un commentaire",
// 							html:
// 								"<p>Bonjour " +
// 								prenom +
// 								",</p></br><p>Un nouveau commentaire a été rédigé sur ta publication : '" +
// 								titre +
// 								"'.</p></br><p>Va vite voir !</p><a href='http://localhost:8080'>Réso' Mouto'</a></br></br><p>Merci de ne pas répondre à cet email.</p><p>A bientôt sur le Réso Mouto !</p>",
// 						},
// 						(error, info) => {
// 							if (error) {
// 								return res.status(401).send(error);
// 							}
// 							res.status(200).send("email envoyé !");
// 						}
// 					);
// 				}
// 			})
// 			.catch((err) => res.status(401).send("bad request"));
// 	});
// };
