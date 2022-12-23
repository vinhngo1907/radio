const { authMiddleware } = require('../middlewares');
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
                authMiddleware,
                (ctx, next) => {
                    return next();
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
                authMiddleware,
                (ctx, next) => {
                    return next();
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
                authMiddleware,
                (ctx, next) => {
                    return next();
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
                authMiddleware,
                (ctx, next) => {
                    return next();
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
                authMiddleware,
                (ctx, next) => {
                    return next();
                }
            ]
        },
    },
]