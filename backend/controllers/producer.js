const { producer } = require("../models");

// * Create a new producer
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
		});
};

// * Get all producers
exports.getAllProducers = (req, res) => {
	producer
		.findAll({
			order: [["entreprise", "ASC"]],
		})
		.then((obj) => {
			res.send(obj);
		});
};

// * Get datas of a producer via id
exports.getProducer = (req, res) => {
	producer
		.findOne({
			where: { id: req.params.producerid },
		})
		.then((obj) => {
			res.send(obj);
		});
};
// * Get producerId via entreprise
exports.getProducerId = (req, res) => {
	producer
		.findOne({
			where: { entreprise: req.params.entreprise },
		})
		.then((obj) => {
			res.send(obj);
		})
		.catch((err) => {
			res.status(401).send(err);
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
