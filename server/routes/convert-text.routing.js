const auth = require("../middlewares/auth");

module.exports = [
    {
		method: 'PUT',
		path: '/api/convert-text',
		handler: 'convertTextController.update',
		config: {
			policies: [],
			auth: false,
			middlewares: [
				(ctx, next) => {
					return auth(ctx, next)
				}
			]
		},
	},
]