const auth = require("../middlewares/auth");

module.exports = [
    {
		method: 'GET',
		path: '/api/medias',
		handler: 'mediaController.find',
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
	{
		method: 'GET',
		path: '/api/medias/:id',
		handler: 'mediaController.findOne',
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
	{
		method: 'POST',
		path: '/api/medias',
		handler: 'mediaController.create',
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
	{
		method: 'PUT',
		path: '/api/medias/:id',
		handler: 'mediaController.update',
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
	{
		method: 'DELETE',
		path: '/api/medias/:id',
		handler: 'mediaController.delete',
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