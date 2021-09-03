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

// * Get datas of a date via id
exports.getDate = (req, res) => {
	date.findOne({
		where: { id: req.params.dateid },
	}).then((obj) => {
		res.send(obj);
	});
};

//* Find dateId from 2 weeks before today and so on
// Find delivery date when today-15 < delivery date < end of table
const twoWeeksBefore = new Date(new Date(today).getTime() - 15 * 24 * 60 * 60 * 1000); // today -15 days
exports.suggest = (req, res) => {
	date.findAll({
		order: [["delivery_date", "ASC"]],
		where: { delivery_date: { [Op.gt]: twoWeeksBefore } },
	})
		.then((obj) => {
			// res.status(200).send(obj.delivery_date);
			res.status(200).send(obj);
		})
		.catch((err) => {
			res.status(401).send(err);
		});
};
