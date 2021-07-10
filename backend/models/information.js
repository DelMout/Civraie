const { Sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
	const information = sequelize.define(
		"information",
		{
			item: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			title: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			content: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			timestamps: false,
		}
	);
	return information;
};
