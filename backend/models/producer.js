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
				validate: {
					notEmpty: true,
					is: ["^[a-zÀ-ÿ-]+$", "i"],
				},
			},
			entreprise: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			products: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			address: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			phone: {
				type: DataTypes.INT,
				allowNull: true,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: true,
				validate: {
					isEmail: true,
				},
			},
		},
		{
			timestamps: false,
		}
	);
	return producer;
};
