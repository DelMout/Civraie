const { Sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
	const date = sequelize.define(
		"date",
		{
			latest_date_order: {
				type: DataTypes.DATEONLY,
				allowNull: false,
			},
			delivery_date: {
				type: DataTypes.DATEONLY,
				allowNull: false,
			},
		},
		{
			timestamps: false,
		}
	);
	return date;
};
