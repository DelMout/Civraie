const { category } = require("../models");

// * Get all categories
exports.getCategories = (req, res) => {
	category
		.findAll({
			order: [["id", "ASC"]],
		})
		.then((obj) => {
			res.send(obj);
		});
};

// * Get all categories
exports.getCategory = (req, res) => {
	category
		.findOne({
			where: { id: req.params.categoryId },
		})
		.then((obj) => {
			res.send(obj);
		});
};
