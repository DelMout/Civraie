const { Sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
	const order = sequelize.define(
		"order",
		{
			quantity: {
				type: DataTypes.INTEGER,
				allowNull: false,
				require,
				validate: {
					notEmpty: true,
				},
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
