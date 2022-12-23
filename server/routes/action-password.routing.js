const { authMiddleware } = require('../middlewares');
// const auth = require('../middlewares/auth');
module.exports = [
    {
        method: 'PUT',
        path: '/api/change-password',
        handler: 'actionPasswordController.changePassword',
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
        path: '/api/forgot-password',
        handler: 'actionPasswordController.forgotPassword',
        config: {
            policies: [],
            auth: false,
        },
    },
]