const auth = require('../middlewares/auth');

module.exports = [
    {
        method: 'GET',
        path: '/api/locations',
        handler: 'locationController.find',
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
        path: '/api/locations',
        handler: 'locationController.create',
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
        path: '/api/locations/:id',
        handler: 'locationController.update',
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