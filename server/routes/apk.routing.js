const auth = require('../middlewares/auth');

module.exports = [
	{
		method: 'GET',
		path: '/api/apks',
		handler: 'apkController.find',
		config: {
			policies: [],
			auth: false,
			middlewares: [
				(ctx, next) => {
					return auth(ctx, next)
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
				(ctx, next) => {
					return auth(ctx, next)
				}
			]
		}
	}
]