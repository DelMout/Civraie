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
			cloturedayId: {
				type: DataTypes.TINYINT,
				defaultValue: 0,
			},
			price: {
				type: DataTypes.DECIMAL,
				allowNull: false,
				require,
				validate: {
					notEmpty: true,
				},
			},
			unite_vente: {
				type: DataTypes.STRING,
				allowNull: false,
				require,
				validate: {
					notEmpty: true,
				},
			},
			unity: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			price_unite_vente: {
				type: DataTypes.DECIMAL,
				allowNull: true,
				defaultValue: null,
			},
			stock_init: {
				type: DataTypes.INTEGER,
				allowNull: true,
				defaultValue: null,
			},
			stock_updated: {
				type: DataTypes.INTEGER,
				allowNull: true,
				defaultValue: null,
			},
			alert_stock: {
				type: DataTypes.INTEGER,
				allowNull: true,
				defaultValue: null,
			},
			ordering: {
				type: DataTypes.TINYINT,
				defaultValue: 0,
			},
			active: {
				type: DataTypes.TINYINT,
				defaultValue: 0,
			},
			photo: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{
			timestamps: false,
		}
	);
	return product;
};
