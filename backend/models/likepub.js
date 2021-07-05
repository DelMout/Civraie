const { Sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
	const likep = sequelize.define(
		"likepub",
		{
			symbol: {
				type: DataTypes.STRING,
				allowNull: false,
				require,
			},
		},
		{
			timestamps: false,
		}
	);
	return likep;
};
