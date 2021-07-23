const { product } = require("../models");
const fs = require("fs"); // handle files

//* Create a new product
exports.createProduct = (req, res) => {
	if (req.file) {
		req.body.photo = `https://${req.get("host")}/images/${req.file.filename}`;
	} else {
		req.body.photo = null;
	}
	const newProduct = new product({
		stock_updated: req.body.stock_init,
		...req.body,
	});
	newProduct
		.save()
		.then((prod) => {
			res.send(prod);
		})
		.catch((err) => {
			// res.send(err);
			res.status(401).send(err.errors[0].validatorKey);
		});
};

// * Get all products
exports.getAllProducts = (req, res) => {
	product
		.findAll({
			order: [["product", "ASC"]],
		})
		.then((obj) => {
			res.send(obj);
		});
};

// * Get  products according to ordering
exports.getProductsOrdering = (req, res) => {
	product
		.findAll({
			order: [["product", "ASC"]],
			where: { ordering: req.params.ordering },
		})
		.then((obj) => {
			res.send(obj);
		});
};

// * Get a product
exports.getDatasProduct = (req, res) => {
	product
		.findOne({
			where: { id: req.params.productid },
		})
		.then((obj) => {
			res.send(obj);
		});
};

//* Modify a product
exports.modifProduct = (req, res) => {
	product
		.update(
			{
				...req.body,
			},
			{ where: { id: req.params.productid } }
		)
		.then(() => {
			res.send("datas product modified");
		})
		.catch((err) => {
			res.status(401).send(err);
		});
};

//* Delete a product
exports.deleteProduct = (req, res) => {
	product
		.destroy({ where: { id: req.params.productid } })
		.then(() => {
			res.send("product deleted");
		})
		.catch((err) => {
			res.status(401).send(err);
		});
};
