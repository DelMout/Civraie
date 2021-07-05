const { Sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
	const user = sequelize.define(
		"user",
		{
			prenom: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					notEmpty: true,
					is: ["^[a-zÀ-ÿ-]+$", "i"],
				},
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					isEmail: true,
					notEmpty: true,
				},
			},

			password: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
			},
			date_signup: {
				type: DataTypes.DATEONLY,
				defaultValue: DataTypes.NOW,
				allowNull: false,
			},
			last_connect: {
				type: DataTypes.DATEONLY,
				allowNull: false,
			},
			photo: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			jeton: {
				type: DataTypes.STRING,
				allowNull: true,
				unique: true,
			},
			emailPub: {
				type: DataTypes.TINYINT,
				defaultValue: 0,
			},
			emailCom: {
				type: DataTypes.TINYINT,
				defaultValue: 0,
			},
			isAdmin: {
				type: DataTypes.TINYINT,
				defaultValue: 0,
			},
		},
		{
			timestamps: false,
		}
	);
	return user;
};
