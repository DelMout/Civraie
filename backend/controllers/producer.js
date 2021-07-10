const { producer } = require("../models");
const fs = require("fs");
const { Op } = require("sequelize");

//! * Create a new producer
exports.createProducer = (req, res) => {
	const newProducer = new producer({
		...req.body,
	});
	newProducer
		.save()
		.then((producer) => {
			res.send(producer);
		})
		.catch((err) => {
			res.status(401).send(err);
			// res.status(401).send(err.errors[0].validatorKey);
		});
};

// *
