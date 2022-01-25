const { user } = require("../models");
const { information } = require("../models");
const bcrypt = require("bcrypt"); // crypt password
const jwt = require("jsonwebtoken"); // create token key
const passwordValidator = require("password-validator");
const schemaPassword = new passwordValidator();
const nodemailer = require("nodemailer");
const path = require("path");

//* Schema Password
schemaPassword.is().min(8).has().uppercase().has().lowercase().has().digits();

// * Create a new user
exports.signup = (req, res) => {
	if (!schemaPassword.validate(req.body.password)) {
		return res.status(401).send("password not enough strong");
	} else {
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
				res.status(401).send(err.errors[0].message);
			});
	}
};

// * Login
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
			res.status(401).send(err);
		});
};

// * Get firstname and name from email for a user
exports.firstname = (req, res) => {
	user.findOne({
		where: { email: req.params.email },
	}).then((obj) => {
		res.send(obj);
	});
};

// * Update connexion date and jeton (used when user forgot password)
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
		{ where: { email: req.params.email } }
	)
		.then(() => {
			res.send("user modified !");
		})
		.catch((err) => {
			res.status(401).send(err);
		});
};

// * Update phone number
exports.updatePhone = (req, res) => {
	user.update(
		{
			phone: req.body.phone,
		},
		{ where: { id: req.params.userid } }
	)
		.then(() => {
			res.send("user's phone modified !");
		})
		.catch((err) => {
			res.status(401).send(err);
		});
};

// * Get all users
exports.getAllUsers = (req, res) => {
	user.findAll({
		order: [["last_connect", "ASC"]],
		where: { isAdmin: 0 },
	}).then((obj) => {
		res.send(obj);
	});
};

// * Get datas of a user via id
exports.getUser = (req, res) => {
	user.findOne({
		where: { id: req.params.userid },
	}).then((obj) => {
		res.send(obj);
	});
};

// * Update comment
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
		});
};

// * Modif password
exports.updatePassword = (req, res) => {
	if (!schemaPassword.validate(req.body.password)) {
		return res.status(401).send(schemaPassword.validate(req.body.password, { list: true }));
	} else {
		user.update(
			{
				password: bcrypt.hashSync(req.body.password, 10),
			},
			{ where: { jeton: req.params.jeton } }
		)
			.then(() => {
				res.send("password modified");
			})
			.catch((err) => {
				res.status(401).send(err);
			});
	}
};

// * Delete user from Admin
exports.delete = (req, res) => {
	user.destroy({ where: { id: req.params.userid } })
		.then(() => {
			res.send("user deleted");
		})
		.catch((err) => {
			res.send(err);
		});
};

// * Delete user from a user
exports.deleteMyAccount = (req, res) => {
	user.destroy({ where: { id: req.params.userid } })
		.then(() => {
			res.send("user deleted");
		})
		.catch((err) => {
			res.send(err);
		});
};

//* Find user from jeton
exports.jeton = (req, res) => {
	user.findOne({ where: { jeton: req.params.jeton } })
		.then((resp) => {
			res.status(200).send(resp);
		})
		.catch((err) => {
			res.status(401).send(err);
		});
};

// * Send an email for password forgotten
exports.emailPassword = (req, res) => {
	let transporter = nodemailer.createTransport({
		host: "source.o2switch.net",
		port: 465,
		// secure: true, // true for 465, false for other ports
		tls: {
			rejectUnauthorized: false,
		},
		auth: {
			user: process.env.FROM_EMAIL,
			pass: process.env.PASS_EMAIL,
		},
	});
	// Recherche  jeton
	user.findOne({ where: { email: req.params.email } })
		.then((user) => {
			information
				.findOne({
					where: { item: "open_hours" },
				})
				.then((info) => {
					const openhours = info.content;
					const jeton = user.jeton;
					const email = req.params.email;
					const prenom = user.prenom;
					const nom = user.nom;
					const titre = "[La Civraie] Demande d'initialisation mot de passe";
					const message =
						"<p>Merci de cliquer sur le lien pour saisir un nouveau mot de passe.</p>";
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
								",</p></br>" +
								message +
								"</br><a href='https://fermedelacivraie.delmout.com/setpassword/" +
								jeton +
								"'>Saisir un nouveau mot de passe</a></br></br><p>Merci de ne pas répondre à cet email.</p><p>A bientôt au magasin Civraie, Si Frais.</p><p style='margin:0'>Adrien et Céline Pichon</p><a href='mailto:adrienpichon@live.fr'>adrienpichon@live.fr</a><p style='color:green;font-weight:bold;margin:0;'>Ferme de la Civraie</p><p style='color:green;font-weight:bold;margin:0'>Magasin Civraie, Si Frais</p>" +
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

// * Send an email to all users for specific information
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

	// List of users non isAdmin
	user.findAndCountAll({ where: { isAdmin: 0 } })
		.then((users) => {
			information
				.findOne({
					where: { item: "open_hours" },
				})
				.then((info) => {
					const openhours = info.content;
					const count = users.count;
					for (let i = 0; i < count; i++) {
						// Message for each user
						transporter.sendMail(
							{
								from: "Magasin Civraie Si Frais <lacivraie@delmout.com>",
								to: users.rows[i].email,
								subject: "[La Civraie] " + req.body.title,
								html:
									req.body.content +
									"<p>Passez votre commande sur le site du magasin Civraie, Si Frais :<br/><a href='https://fermedelacivraie.delmout.com/'>Magasin Civraie, Si Frais</a><p>Merci de ne pas répondre à cet email.</p><p>A bientôt au magasin Civraie, Si Frais.</p><p style='margin:0'>Adrien et Céline Pichon</p><a href='mailto:adrienpichon@live.fr'>adrienpichon@live.fr</a><p style='color:green;font-weight:bold;margin:0;'>Ferme de la Civraie</p><p style='color:green;font-weight:bold;margin:0'>Magasin Civraie, Si Frais</p>" +
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
								res.status(200).send("email envoyé à tous !");
							}
						);
					}
				})
				.catch((err) => res.status(401).send(err));
		})
		.catch((err) => res.status(401).send(err));
};
