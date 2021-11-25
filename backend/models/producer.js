const { Sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
	const producer = sequelize.define(
		"producer",
		{
			nom: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
					is: ["^[a-zÀ-ÿ- ']+$", "i"],
				},
			},
			prenom: {
				type: DataTypes.STRING,
				allowNull: true,
				// validate: {
				// 	notEmpty: true,
				// },
			},
			entreprise: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
			},
			products: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
			},
			address: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
			},
			phone: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: true,
				// validate: {
				// 	isEmail: true,
				// },
			},
			site_web: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{
			timestamps: false,
		}
	);
	return producer;
};
