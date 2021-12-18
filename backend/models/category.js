module.exports = (sequelize, DataTypes) => {
	const category = sequelize.define(
		"category",
		{
			category: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			cloture_day: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			class: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			priority: {
				type: DataTypes.TINYINT,
				allowNull: false,
			},
		},
		{
			timestamps: false,
		}
	);
	return category;
};
