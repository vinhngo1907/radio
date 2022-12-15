const auth = require('../middlewares/auth');

module.exports = [
    {
        method: 'GET',
        path: '/api/role-supports',
        handler: 'roleSupportController.getall',
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
        path: '/api/role-supports',
        handler: 'roleSupportController.create',
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
        path: '/api/role-supports/:id',
        handler: 'roleSupportController.update',
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
        path: '/api/role-supports/:id',
        handler: 'roleSupportController.delete',
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