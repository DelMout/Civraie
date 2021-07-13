const { date } = require("../models");
const { Op } = require("sequelize");

//* Find dateId according to today date
exports.find = (req, res) => {
	date.findAll({
		// where: { id: 1 },
		where: { delivery_date: { [Op.gt]: "2021-08-05" } },
	})
		.then((obj) => {
			// res.status(200).send(new Date(obj.delivery_date));
			const daty = new Date(obj.delivery_date);
			const today = Date();
			res.status(200).send(obj);
		})
		.catch((err) => {
			res.status(401).send(err);
		});
};
