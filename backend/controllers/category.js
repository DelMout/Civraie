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
