const { Sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
	const order = sequelize.define(
		"order",
		{
			quantity: {
				type: DataTypes.INT,
				allowNull: false,
				require,
				validate: {
					notEmpty: true,
				},
			},
			delivery_date: {
				type: DataTypes.DATEONLY,
				allowNull: false,
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
