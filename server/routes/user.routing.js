'use strict';

const { authMiddleware } = require("../middlewares");
const auth = require("../middlewares/auth");

module.exports =  [
	{
		method: 'PUT',
		path: '/api/user-register',
		handler: 'userController.register',
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
		path: '/api/user-update',
		handler: 'userController.update',
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
		method: 'GET',
		path: '/api/users',
		handler: 'userController.find',
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
		method: 'GET',
		path: '/api/users/me',
		handler: 'userController.getMe',
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