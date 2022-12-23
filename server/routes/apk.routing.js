const auth = require('../middlewares/auth');
const { authMiddleware } = require("../middlewares");

module.exports = [
	{
		method: 'GET',
		path: '/api/apks',
		handler: 'apkController.find',
		config: {
			policies: [],
			auth: false,
			middlewares: [
				authMiddleware,
				(ctx, next) => {
					return next()
				}
			]
		}
	},
	{
		method: "POST",
		path: '/api/apks',
		handler: 'apkController.create',
		config: {
			policies: [],
			auth: false,
			middlewares: [
				authMiddleware,
				(ctx, next) => {
					return next()
				}
			]
		}
	},
	{
		method: "PUT",
		path: '/api/apks',
		handler: 'apkController.update',
		config: {
			policies: [],
			auth: false,
			middlewares: [
				authMiddleware,
				(ctx, next) => {
					return next()
				}
			]
		}
	}
]