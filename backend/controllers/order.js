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

// * Get orders according to delivery date (dateId)
exports.getAllOrders = (req, res) => {
	order
		.findAll({
			where: { dateid: req.params.dateid },
		})
		.then((obj) => {
			res.send(obj);
		});
};

// * Get orders according to delivery date (dateId) and sorted by user
exports.getOrdersByUser = (req, res) => {
	order
		.findAll({
			where: { dateid: req.params.dateid },
			order: [["userid", "ASC"]],
		})
		.then((obj) => {
			res.send(obj);
		});
};

// * Get orders according to delivery date (dateId) and sorted by product
exports.getOrdersByProd = (req, res) => {
	order
		.findAll({
			where: { dateid: req.params.dateid },
			order: [["productid", "ASC"]],
		})
		.then((obj) => {
			res.send(obj);
		});
};
