const auth = require("../middlewares/auth");
const { authMiddleware } = require("../middlewares");
module.exports = [
    {
		method: 'PUT',
		path: '/api/convert-text',
		handler: 'convertTextController.update',
		config: {
			policies: [],
			auth: false,
			middlewares: [
				authMiddleware,
				(ctx, next) => {
					return next();
				}
			]
		},
	},
]