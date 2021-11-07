const { product } = require("../models");
const fs = require("fs"); // handle files
const { Op } = require("sequelize");

//* Create a new product
exports.createProduct = (req, res) => {
	if (req.file) {
		req.body.photo = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
	} else {
		req.body.photo = null;
	}
	const newProduct = new product({
		stock_updated: req.body.stock_init,
		...req.body,
	});
	newProduct
		.save()
		.then((prod) => {
			res.send(prod);
		})
		.catch((err) => {
			// res.send(err);
			res.status(401).send(err.errors[0].validatorKey);
		});
};

// * Get all products
exports.getAllProducts = (req, res) => {
	product
		.findAll({
			order: [["product", "ASC"]],
		})
		.then((obj) => {
			res.send(obj);
		});
};

// * Get  products according to ordering
exports.getProductsOrdering = (req, res) => {
	product
		.findAll({
			order: [["product", "ASC"]],
			where: { active: 1 },
		})
		.then((obj) => {
			res.send(obj);
		});
};

// * Get all products actived
exports.getProductsActived = (req, res) => {
	product
		.findAll({
			order: [["product", "ASC"]],
			where: { active: 1 },
		})
		.then((obj) => {
			res.send(obj);
		});
};

// * Get  products according to ordering=1 and 2 AND category AND active=1
exports.getProductsCategory = (req, res) => {
	product
		.findAll({
			order: [["product", "ASC"]],
			where: {
				[Op.and]: [
					{ [Op.or]: [{ ordering: 1 }, { ordering: 2 }] },
					{ categoryId: req.params.category },
					{ active: 1 },
				],
			},
		})
		.then((obj) => {
			res.send(obj);
		});
};

// * Get a product
exports.getDatasProduct = (req, res) => {
	product
		.findOne({
			where: { id: req.params.productid },
		})
		.then((obj) => {
			res.send(obj);
		});
};

//* Modify a product
exports.modifProduct = (req, res) => {
	if (req.file) {
		req.body.photo = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
		//delete the previous image file
		product
			.findOne({ where: { id: req.params.productid } })
			.then((rep) => {
				if (rep.photo != null) {
					//if already photo
					const filename = rep.photo.split("/images/")[1];
					fs.unlink(`images/${filename}`, () => {
						product
							.update({ ...req.body }, { where: { id: req.params.productid } })
							.then(() => {
								res.send("product and image file modified");
							})
							.catch((err) => {
								res.send(err);
							});
					});
				} else {
					product
						.update({ ...req.body }, { where: { id: req.params.productid } })
						.then(() => {
							res.send("product modified and image file saved");
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
		// req.body.photo = null;
		product
			.update(
				{
					...req.body,
				},
				{ where: { id: req.params.productid } }
			)
			.then(() => {
				res.send("product modified !");
			})
			.catch((err) => {
				res.status(401).send(err);
				// res.status(401).send(err.errors[0].validatorKey);
			});
	}
};

//* Delete a product
//! Rajouter suppression photo
exports.deleteProduct = (req, res) => {
	product
		.findOne({ where: { id: req.params.productid } })
		.then((prod) => {
			if (prod.photo != null) {
				const filename = prod.photo.split("/images/")[1];
				fs.unlink(`images/${filename}`, () => {
					product
						.destroy({ where: { id: req.params.productid } })
						.then(() => res.send("product and image file deleted"))
						.catch((err) => {
							res.send(err);
						});
				});
			} else {
				product
					.destroy({ where: { id: req.params.productid } })
					.then(() => res.send("product deleted"))
					.catch((err) => {
						res.send(err);
					});
			}
		})
		.catch((err) => {
			res.send(err);
		});
};

// * Change "active" of a product
exports.changeActive = (req, res) => {
	product
		.update(
			{
				active: req.params.active,
			},
			{ where: { id: req.params.productid } }
		)
		.then(() => {
			res.send("active modified !");
		})
		.catch((err) => {
			// res.status(401).send(err);
			res.status(401).send(err.errors[0].validatorKey);
		});
};

//! * Check if product must become inactive (after clotureday)
exports.checkActive = (req, res) => {
	product
		.findAll({
			where: { active: 1 },
		})
		.then((prod) => {
			const weekday = new Date().getDay();
			if (weekday < 6 && weekday > 0) {
				// excepted Sunday & Saturday
				for (let i = 0; i < prod.length; i++) {
					if (weekday > prod[i].cloturedayId) {
						product
							.update(
								{
									active: 0,
								},
								{ where: { id: prod[i].id } }
							)
							.then(() => {
								res.send("product inactived !");
							})
							.catch((err) => {
								res.status(401).send(err);
							});
					}
				}
			}
		})
		.catch((err) => {
			res.status(401).send(err);
		});
};
