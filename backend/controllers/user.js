const { user } = require("../models");
const { publication } = require("../models");
const fs = require("fs"); // handle files
const bcrypt = require("bcrypt"); // crypt password
const jwt = require("jsonwebtoken"); // create token key
const passwordValidator = require("password-validator");
const schemaPassword = new passwordValidator();
const nodemailer = require("nodemailer");
const { resolve } = require("path");

//* Schema Password
schemaPassword.is().min(10).has().uppercase().has().lowercase().has().digits();

//* Send an email for 1rest connection or password forgotten (req.params.prenom)
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
	// Recherche email et jeton
	user.findOne({ where: { prenom: req.params.prenom } })
		.then((user) => {
			const email = user.email;
			const jeton = user.jeton;
			// Message for 1rst connexion or password forgotten
			// const titre="";
			if (req.params.message === "first") {
				const titre = "Bienvenue dans le réso Mouto !";
				const message =
					"<p>Merci de cliquer sur le lien. Tu pourras alors choisir ton mot de passe et tes préférences concernant les envois de mails automatiques.</p>";

				transporter.sendMail(
					{
						from: "DelphAdmin du Réso Mouto <reso.mouto@delmout.com>",
						to: email,
						subject: titre,
						html:
							"<p>Bonjour " +
							req.params.prenom +
							",</p></br>" +
							message +
							"</br><a href='http://localhost:8080/setpassword/" +
							jeton +
							"'>Lien pour ton mot de passe du Réso Mouto</a></br></br><p>Merci de ne pas répondre à cet email.</p><p>A bientôt sur le Réso Mouto !</p><p>DelphAdmin</p>",
					},
					(error, info) => {
						if (error) {
							return res.status(401).send(error);
						}
						res.status(200).send("email envoyé !");
					}
				);
			} else {
				const titre = "Alors ?! On a perdu son mot de passe !";
				const message =
					"<p>Tu cliques sur le lien et tu pourras saisir un nouveau mot de passe.</p>";
				transporter.sendMail(
					{
						from: "DelphAdmin du Réso Mouto <reso.mouto@delmout.com>",
						to: email,
						subject: titre,
						html:
							"<p>Bonjour " +
							req.params.prenom +
							",</p></br>" +
							message +
							"</br><a href='http://localhost:8080/setpassword/" +
							jeton +
							"'>Lien pour ton mot de passe du Réso Mouto</a></br></br><p>Merci de ne pas répondre à cet email.</p><p>A bientôt sur le Réso Mouto !</p><p>DelphAdmin</p>",
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

//* Send an email to users when new publication
exports.emailPub = (req, res) => {
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
	// List of users want receive email
	user.findAndCountAll({ where: { emailPub: 1 } })
		.then((users) => {
			// res.send(users);
			const count = users.count;
			for (let i = 0; i < count; i++) {
				// Message for each user
				transporter.sendMail(
					{
						from: "DelphAdmin du Réso Mouto <reso.mouto@delmout.com>",
						to: users.rows[i].email,
						subject: "[Réso' Mouto'] " + req.params.prenom + " vient de publier",
						html:
							"<p>Bonjour " +
							users.rows[i].prenom +
							",</p></br><p>Une nouvelle publication a été rédigée sur le Réso Mouto : '" +
							req.params.titre +
							"'.</p></br><p>Va vite voir !</p><a href='http://localhost:8080'>Réso' Mouto'</a></br></br><p>Merci de ne pas répondre à cet email.</p><p>A bientôt sur le Réso Mouto !</p>",
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

//* Send an email to user's publication when new comment
exports.emailCom = (req, res) => {
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
	// Who wrote publication
	publication.findOne({ where: { id: req.params.pubid } }).then((pub) => {
		const userId = pub.userId;
		const titre = pub.titre;
		user.findOne({ where: { id: userId } })
			.then((userPub) => {
				const choiceCom = userPub.emailCom;
				const email = userPub.email;
				const prenom = userPub.prenom;
				if (choiceCom === 1) {
					// Message for the user's publication
					transporter.sendMail(
						{
							from: "DelphAdmin du Réso Mouto <reso.mouto@delmout.com>",
							to: email,
							subject: "[Réso' Mouto'] Ta publication a reçu un commentaire",
							html:
								"<p>Bonjour " +
								prenom +
								",</p></br><p>Un nouveau commentaire a été rédigé sur ta publication : '" +
								titre +
								"'.</p></br><p>Va vite voir !</p><a href='http://localhost:8080'>Réso' Mouto'</a></br></br><p>Merci de ne pas répondre à cet email.</p><p>A bientôt sur le Réso Mouto !</p>",
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

// * Create a new user
exports.signup = (req, res) => {
	if (req.file) {
		req.body.photo = `https://${req.get("host")}/images/${req.file.filename}`;
	} else {
		req.body.photo = null;
	}
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
			last_connect: 0,
			jeton: jeton,
		});
		newUser
			.save()
			.then((user) => {
				res.send(user);
			})
			.catch((err) => {
				res.status(401).send(err);
			});
	}
};

// * Login
exports.login = (req, res) => {
	const prenom_saisi = req.body.prenom;
	const password_saisi = req.body.password;
	user.findOne({ where: { prenom: prenom_saisi } })
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
			res.status(401).send("Firstname not OK");
		});
};

// * Demand modify (click button)
exports.demandmodif = (req, res) => {
	const userId = req.params.userid;
	user.findOne({ where: { id: userId } })
		.then((rep) => {
			res.send(rep);
		})
		.catch((err) => {
			res.send(err);
		});
};

// * Modify
exports.modif = (req, res) => {
	if (!schemaPassword.validate(req.body.password)) {
		return res.status(401).send(schemaPassword.validate(req.body.password, { list: true }));
	} else {
		if (req.file) {
			req.body.photo = `https://${req.get("host")}/images/${req.file.filename}`;
			//delete the previous image file
			user.findOne({ where: { id: req.params.userid } })
				.then((rep) => {
					if (rep.photo != null) {
						const filename = rep.photo.split("/images/")[1];
						fs.unlink(`images/${filename}`, () => {
							user.update(
								{ ...req.body, password: bcrypt.hashSync(req.body.password, 10) },
								{ where: { id: req.params.userid } }
							)
								.then(() => {
									res.send("user and image file modified");
								})
								.catch((err) => {
									res.send(err);
								});
						});
					} else {
						user.update(
							{ ...req.body, password: bcrypt.hashSync(req.body.password, 10) },
							{ where: { id: req.params.userid } }
						)
							.then(() => {
								res.send("user modified and image file saved");
							})
							.catch((err) => {
								res.send(err);
							});
					}
				})
				.catch((err) => {
					res.status(401).send(err.errors[0].validatorKey);
				});
		} else {
			req.body.photo = null;
			user.update(
				{
					...req.body,
					password: bcrypt.hashSync(req.body.password, 10),
				},
				{ where: { id: req.params.userid } }
			)
				.then(() => {
					res.send("user modified !");
				})
				.catch((err) => {
					// res.status(401).send(err);
					res.status(401).send(err.errors[0].validatorKey);
				});
		}
	}
};

//* Modif password
exports.modifPassword = (req, res) => {
	if (!schemaPassword.validate(req.body.password)) {
		return res.status(401).send(schemaPassword.validate(req.body.password, { list: true }));
	} else {
		user.update(
			{
				email: req.body.email,
				emailPub: req.body.emailPub,
				emailCom: req.body.emailCom,
				password: bcrypt.hashSync(req.body.password, 10),
			},
			{ where: { id: req.params.userid } }
		)
			.then(() => {
				res.send("datas user modified");
			})
			.catch((err) => {
				res.status(401).send(err);
			});
	}
};

//* Update connexion date and jeton (used when user forgot password)
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

// * Delete user
exports.delete = (req, res) => {
	user.findOne({ where: { id: req.params.userid } })
		.then((resp) => {
			if (resp.photo != null) {
				const filename = resp.photo.split("/images/")[1];
				fs.unlink(`images/${filename}`, () => {
					user.destroy({ where: { id: req.params.userid } })
						.then(() => {
							res.send("user and image file deleted");
						})
						.catch((err) => {
							res.send(err);
						});
				});
			} else {
				user.destroy({ where: { id: req.params.userid } })
					.then(() => {
						res.send("user deleted");
					})
					.catch((err) => {
						res.send(err);
					});
			}
		})
		.catch((err) => res.status(500).json({ err }));
};

// * Get all users
exports.getAllUsers = (req, res) => {
	user.findAll({
		order: [["last_connect", "ASC"]],
	}).then((obj) => {
		res.send(obj);
	});
};

// * Identify user
exports.ident = (req, res) => {
	user.findOne({ where: { id: req.params.userid } })
		.then((resp) => {
			res.send(resp);
		})
		.catch((err) => {
			res.send(err);
		});
};

// * Find user from jeton
exports.userJeton = (req, res) => {
	user.findOne({ where: { jeton: req.params.jeton } })
		.then((resp) => {
			res.status(200).send(resp);
		})
		.catch((err) => {
			res.status(401).send(err);
		});
};

// * Find user by email
exports.findUser = (req, res) => {
	user.findAll({ where: { email: req.params.email } })
		.then((resp) => {
			if (resp.prenom) {
				res.status(200).send(resp);
			} else {
				res.status(404).send("no user with that email");
			}
		})
		.catch((err) => {
			res.status(404).send("no user with that email");
		});
};
