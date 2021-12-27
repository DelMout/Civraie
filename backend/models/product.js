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
			producerId: {
				type: DataTypes.TINYINT,
				allowNull: false,
				require,
				validate: {
					notEmpty: true,
				},
			},
			categoryId: {
				type: DataTypes.TINYINT,
				allowNull: false,
				require,
				validate: {
					notEmpty: true,
				},
			},
			cloturedayId: {
				type: DataTypes.TINYINT,
				allowNull: false,
				require,
				validate: {
					notEmpty: true,
				},
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
			stock_manag: {
				type: DataTypes.TINYINT,
				allowNull: true,
				defaultValue: 0,
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
			stock_in_date: {
				type: DataTypes.DATEONLY,
				allowNull: true,
			},
			ordering: {
				type: DataTypes.TINYINT,
				defaultValue: 0,
			},
			active: {
				type: DataTypes.TINYINT,
				defaultValue: 0,
			},
			active_date: {
				type: DataTypes.DATEONLY,
				allowNull: true,
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
