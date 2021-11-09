const { information } = require("../models");
const { Op } = require("sequelize");

// * Get content from item (support vente)
exports.supportVente = (req, res) => {
	information
		.findOne({
			where: {
				[Op.and]: [{ item: req.params.item }, { title: "Ordering" }],
			},
		})
		.then((obj) => {
			res.send(obj.content);
		})
		.catch((err) => {
			res.send(err);
		});
};

// * Get all ordering/Weekday (title=Ordering/weekday)
exports.allInformations = (req, res) => {
	information
		.findAll({
			where: { title: req.params.title },
		})
		.then((obj) => {
			res.send(obj);
		})
		.catch((err) => {
			res.send(err);
		});
};

// * Get opening hours
exports.openHours = (req, res) => {
	information
		.findOne({
			where: { item: "open_hours" },
		})
		.then((obj) => {
			res.send(obj.content);
		})
		.catch((err) => {
			res.send(err);
		});
};

// * Save modification of opening hours
exports.modifOpenHours = (req, res) => {
	information
		.update(
			{ ...req.body },
			{
				where: { item: "open_hours" },
			}
		)
		.then((obj) => {
			res.send(obj);
		})
		.catch((err) => {
			res.send(err);
		});
};
