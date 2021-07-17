const { order } = require("../models");
const fs = require("fs");
const { Op } = require("sequelize");

// * Create a new order
exports.createOrder = (req, res) => {
	const newOrder = new order({
		...req.body,
		userId: req.params.userid,
		dateId: req.params.dateid,
	});
	newOrder
		.save()
		.then((order) => {
			res.send(order);
		})
		.catch((err) => {
			res.status(401).send(err);
			// res.status(401).send(err.errors[0].validatorKey);
		});
};

//! * Get all producers
exports.getAllProducers = (req, res) => {
	producer
		.findAll({
			order: [["entreprise", "ASC"]],
		})
		.then((obj) => {
			res.send(obj);
		});
};

//* Modify producer datas
exports.modifProducer = (req, res) => {
	producer
		.update(
			{
				...req.body,
			},
			{ where: { id: req.params.producerid } }
		)
		.then(() => {
			res.send("datas producer modified");
		})
		.catch((err) => {
			res.status(401).send(err);
		});
};

//* Delete a producer
exports.deleteProducer = (req, res) => {
	producer
		.destroy({ where: { id: req.params.producerid } })
		.then(() => {
			res.send("producer deleted");
		})
		.catch((err) => {
			res.status(401).send(err);
		});
};
