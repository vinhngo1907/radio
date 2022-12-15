const auth = require('../middlewares/auth');


module.exports = [
    {
        method: 'GET',
        path: '/api/devices',
        handler: 'deviceController.getall',
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
        path: '/api/devices/:id',
        handler: 'deviceController.findOne',
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
        path: '/api/devices',
        handler: 'deviceController.create',
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
        path: '/api/devices/:id',
        handler: 'deviceController.update',
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
        path: '/api/devices/:id',
        handler: 'deviceController.delete',
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