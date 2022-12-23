const { authMiddleware } = require('../middlewares');
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
                authMiddleware,
                (ctx, next) => {
                    return next();
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
                authMiddleware,
                (ctx, next) => {
                    return next();
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
                authMiddleware,
                (ctx, next) => {
                    return next();
                }
            ]
        },
    },
]