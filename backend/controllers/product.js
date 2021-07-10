const { product } = require("../models");
const fs = require("fs"); // handle files

//* Create a new product
exports.createProduct = (req, res) => {
	// if (req.file) {
	// 	req.body.photo = `https://${req.get("host")}/images/${req.file.filename}`;
	// } else {
	// 	req.body.photo = null;
	// }
	const newProduct = new product({
		...req.body,
	});
	newPub
		.save()
		.then((prod) => {
			res.send(prod);
		})
		.catch((err) => {
			// res.send(err);
			res.status(401).send(err.errors[0].validatorKey);
		});
};
