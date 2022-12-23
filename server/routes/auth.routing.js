'use strict';

const auth = require("../middlewares/auth");
const { loginValid } = require("../validations");

module.exports = [
	{
		method: 'PUT',
		path: '/api/login',
		handler: 'authController.login',
		config: {
			policies: [],
			auth: false,
			middlewares: [
				loginValid,
				(ctx, next) => {
					return next();
				}
			]
		},
	},
	{
		method: "PUT",
		path: '/api/token',
		handler: 'authController.refreshToken',
		config: {
			policies: [],
			auth: false,
			// middlewares: [
			// 	(ctx, next) => {
			// 		return auth(ctx, next)
			// 	}
			// ]
		}
	},
];