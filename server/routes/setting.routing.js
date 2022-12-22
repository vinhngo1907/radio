const { authMiddleware } = require("../middlewares");
const auth = require("../middlewares/auth");

module.exports = [
    {
		method: 'GET',
		path: '/api/setting',
		handler: 'settingController.find',
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
	{
		method: 'PUT',
		path: '/api/setting',
		handler: 'settingController.update',
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
	{
		method: 'POST',
		path: '/api/setting',
		handler: 'settingController.create',
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