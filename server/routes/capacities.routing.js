const auth = require('../middlewares/auth');

module.exports = [
    {
        method: 'GET',
        path: '/api/capacities',
        handler: 'capacitiesController.getall',
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
        path: '/api/capacities',
        handler: 'capacitiesController.create',
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
        path: '/api/capacities/:id',
        handler: 'capacitiesController.update',
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
        path: '/api/capacities/:id',
        handler: 'capacitiesController.delete',
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
];