const auth = require('../middlewares/auth');

module.exports = [
    {
		method: 'POST',
		path: '/api/text-to-speed-callbacks',
		handler: 'textToSpeechCallbackController.create',
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
		path: '/api/text-to-speed-callbacks',
		handler: 'textToSpeechCallbackController.find',
		config: {
			policies: [],
			auth: false,
			middlewares: [
				(ctx, next) => {
					return auth(ctx, next)
				},
				(ctx, next) =>{
					
				}
			]
		},
	},
]