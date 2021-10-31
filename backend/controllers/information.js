const { information } = require("../models");

// * Get content from item (support vente)
exports.supportVente = (req, res) => {
	information
		.findOne({
			where: { item: req.params.item },
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
