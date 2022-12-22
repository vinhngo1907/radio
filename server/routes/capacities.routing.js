const auth = require('../middlewares/auth');
const { authMiddleware } = require("../middlewares");

module.exports = [
    {
        method: 'GET',
        path: '/api/capacities',
        handler: 'capacitiesController.getall',
        config: {
            policies: [],
            auth: false,
            middlewares: [
                authMiddleware,
                (ctx, next) => {
                    return next()
                }
            ]
        },
    },
    {
        method: 'POST',
        path: '/api/capacities',
        handler: 'capacitiesController.create',
        config: {
            policies: [],
            auth: false,
            middlewares: [
                authMiddleware,
                (ctx, next) => {
                    return next()
                }
            ]
        },
    },
    {
        method: 'PUT',
        path: '/api/capacities/:id',
        handler: 'capacitiesController.update',
        config: {
            policies: [],
            auth: false,
            middlewares: [
                authMiddleware,
                (ctx, next) => {
                    return next()
                }
            ]
        },
    },
    {
        method: 'DELETE',
        path: '/api/capacities/:id',
        handler: 'capacitiesController.delete',
        config: {
            policies: [],
            auth: false,
            middlewares: [
                authMiddleware,
                (ctx, next) => {
                    return next()
                }
            ]
        },
    },
];