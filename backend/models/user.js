module.exports = (sequelize, DataTypes) => {
	const user = sequelize.define(
		"user",
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
				allowNull: false,
				validate: {
					notEmpty: true,
					is: ["^[a-zÀ-ÿ-]+$", "i"],
				},
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					isEmail: true,
					notEmpty: true,
				},
			},
			phone: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
					is: ["^[0-9 -.]{10,}$", "i"],
				},
			},

			password: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
				},
			},
			jeton: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},

			last_connect: {
				type: DataTypes.DATEONLY,
				defaultValue: DataTypes.NOW,
				allowNull: false,
			},

			comment: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			isAdmin: {
				type: DataTypes.TINYINT,
				defaultValue: 0,
			},
			consent_RGPD: {
				type: DataTypes.TINYINT,
				allowNull: false,
			},
			consent_date: {
				type: DataTypes.DATEONLY,
				allowNull: false,
			},
		},
		{
			timestamps: false,
		}
	);
	return user;
};
