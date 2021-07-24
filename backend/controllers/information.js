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

// * Get all ordering (title=Ordering)
exports.allSupportsVente = (req, res) => {
	information
		.findAll({
			where: { title: "Ordering" },
		})
		.then((obj) => {
			res.send(obj);
		});
};
