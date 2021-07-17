const { date } = require("../models");
const { Op } = require("sequelize");

//* Find dateId according to today date
// Find delivery date when today+3 < delivery date < today+9
const today = Date();
const inThreeDays = new Date(new Date(today).getTime() + 3 * 24 * 60 * 60 * 1000); // today + 3 days
const inNineDays = new Date(new Date(today).getTime() + 9 * 24 * 60 * 60 * 1000); // today + 9 days
exports.find = (req, res) => {
	date.findOne({
		where: {
			[Op.and]: [
				{ delivery_date: { [Op.lt]: inNineDays } },
				{ delivery_date: { [Op.gt]: inThreeDays } },
			],
		},
	})
		.then((obj) => {
			// res.status(200).send(obj.delivery_date);
			res.status(200).send(obj);
		})
		.catch((err) => {
			res.status(401).send(err);
		});
};

//* Modify dates
exports.update = (req, res) => {
	date.update(
		{
			...req.body,
		},
		{ where: { id: req.params.dateid } }
	)
		.then(() => {
			res.send("datas date modified");
		})
		.catch((err) => {
			res.status(401).send(err);
		});
};
