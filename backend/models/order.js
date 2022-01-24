const { Sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
	const order = sequelize.define(
		"order",
		{
			delivery_date: {
				type: DataTypes.STRING,
				allowNull: false,
				require,
				validate: {
					notEmpty: true,
				},
			},
			quantity: {
				type: DataTypes.INTEGER,
				allowNull: false,
				require,
				validate: {
					notEmpty: true,
				},
			},
			escarg: {
				type: DataTypes.TINYINT,
				defaultValue: 0,
			},
		},
		{
			timestamps: true,
			updatedAt: false,
			createdAt: "order_date",
			defaultValue: DataTypes.NOW,
		}
	);
	return order;
};
