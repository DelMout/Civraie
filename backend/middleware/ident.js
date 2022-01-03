const { user } = require("../models");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	user.findOne({ where: { id: req.params.userid } })
		.then((user) => {
			try {
				const token = req.headers.authorization.split(" ")[1];
				const decodedToken = jwt.verify(token, process.env.JWT_KEY);
				const userConnectedId = decodedToken.userId;
				const userAuthorId = user.id;
				const isAdmin = decodedToken.isAdmin;
				if (
					(isAdmin === 0 && userConnectedId !== userAuthorId) ||
					(isAdmin === 1 && userConnectedId !== parseInt(process.env.ID_ADMIN))
				) {
					throw "Connected user is not the publication author, or not admin.";
				} else {
					next();
				}
			} catch {
				res.status(401).send("Invalid request!");
			}
		})
		.catch((error) => res.status(400).send(error));
};
