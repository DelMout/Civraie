const { Sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
	const product = sequelize.define(
		"product",
		{
			product: {
				type: DataTypes.STRING,
				allowNull: false,
				require,
				validate: {
					notEmpty: true,
				},
			},
			price_kg: {
				type: DataTypes.DECIMAL,
				allowNull: true,
			},
			unite_vente: {
				type: DataTypes.STRING,
				allowNull: false,
				require,
				validate: {
					notEmpty: true,
				},
			},
			price_unite_vente: {
				type: DataTypes.DECIMAL,
				allowNull: true,
			},
			stock_init: {
				type: DataTypes.INT,
				allowNull: false,
				require,
				validate: {
					notEmpty: true,
				},
			},
			stock_updated: {
				type: DataTypes.INT,
				allowNull: true,
			},
			alert_stock: {
				type: DataTypes.INT,
				allowNull: false,
				require,
				validate: {
					notEmpty: true,
				},
			},
			ordering: {
				type: DataTypes.TINYINT,
				defaultValue: 0,
			},
		},
		{
			timestamps: true,
			updatedAt: false,
			createdAt: "date_crea_pub",
			defaultValue: DataTypes.NOW,
		}
	);
	return product;
};
