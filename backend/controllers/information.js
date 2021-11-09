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
		});
};
