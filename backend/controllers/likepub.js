const { likepub } = require("../models");

// * Add a like
exports.addLike = (req, res) => {
	// check if user not already liked
	likepub
		.findOne({ where: { publicationId: req.params.pubid } })
		// .findOne({ where: { publicationId: req.params.pubid, userId: req.params.userid } })
		.then((resp) => {
			res.send(resp);
			if (resp === null) {
				const likes = new likepub({
					userId: req.params.userid,
					publicationId: req.params.pubid,
					symbol: "heart",
				});
				likes
					.save()
					.then((like) => {
						res.send(like);
					})
					.catch((err) => {
						res.send(err);
					});
			} else {
				likepub
					.destroy({
						where: { publicationId: req.params.pubid, userId: req.params.userid },
					})
					.then(() => res.send("like deleted"))
					.catch((err) => res.send(err));
			}
		})
		.catch((err) => {
			res.send(err);
		});
};
// * Count likes for a publication
exports.countLike = (req, res) => {
	likepub
		.findAll({ where: { publicationId: req.params.pubid } })
		.then((likes) => {
			res.send(likes);
		})
		.catch((err) => {
			res.send(err);
		});
};

//* Count each symbol
//TODO Fonctionne !!!
exports.countSymbol = (req, res) => {
	// Compte le nombre de heart de la pub
	likepub
		.findAndCountAll({
			where: { publicationId: req.params.pubid, symbol: req.params.symbol },
		})
		.then((resp) => {
			// console.log(resp.count); // Donne qty du symbol
			res.send(resp); //! dans front prendre resp.data.count en appliquant ce res.send
		})
		.catch((err) => {
			res.send(err);
		});
};

//TODO Fonctionne !!!
//* Give symbol selected by user
exports.whichSymbol = (req, res) => {
	likepub
		.findOne({
			where: { publicationId: req.params.pubid, userId: req.params.userid },
		})
		.then((resp) => {
			// if (resp.symbol === null) {
			// 	res.send(null);
			// } else {
			res.send(resp.symbol);
			// }
		})
		.catch((err) => {
			res.send(err);
		});
};

//* Add a symbol
//TODO Fonctionne !!!
// Si on reclique sur la même symbole, alors on annule notre sélection.
// Si on clique sur un autre symbole, on supprime le 1er symbole et on ajoute l'autre symbole.
exports.addSymbol = (req, res) => {
	// Check if user already liked
	likepub
		.findOne({
			where: {
				publicationId: req.params.pubid,
				userId: req.params.userid,
			},
		})
		.then((respo) => {
			if (respo === null) {
				// user not yet liked
				const likes = new likepub({
					userId: req.params.userid,
					publicationId: req.params.pubid,
					symbol: req.params.symbol,
				});
				likes
					.save()
					.then((resp) => {
						res.send(resp);
					})
					.catch((err) => {
						res.send(err);
					});
			} else {
				// check if the same symbol
				likepub
					.findOne({
						where: {
							publicationId: req.params.pubid,
							userId: req.params.userid,
							// symbol: req.params.symbol,
						},
					})
					.then((respon) => {
						const prevSymbol = respon.symbol;
						// res.send(prevSymbol);
						// if symbol different
						if (prevSymbol !== req.params.symbol) {
							// user already liked. Symbol updated
							likepub
								.update(
									{ ...req.body, symbol: req.params.symbol },
									{
										where: {
											publicationId: req.params.pubid,
											userId: req.params.userid,
										},
									}
								)
								.then((resp) => {
									// res.send(respon);
									res.send(prevSymbol);
								})
								.catch((err) => {
									res.send(err);
								});
						} else {
							// user already liked with that symbol so delete it
							likepub
								.destroy({
									where: {
										publicationId: req.params.pubid,
										userId: req.params.userid,
										symbol: req.params.symbol,
									},
								})
								.then(() => res.send("like deleted"))
								.catch((err) => res.send(err));
						}
					})
					.catch((err) => {
						res.send(err);
					});
			}
		})
		.catch((err) => {
			res.send(err);
		});
};
