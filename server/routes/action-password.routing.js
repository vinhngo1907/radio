// const { auth } = require('../middlewares/index');
const auth = require('../middlewares/auth');
module.exports = [
    {
        method: 'PUT',
        path: '/api/change-password',
        handler: 'actionPasswordController.changePassword',
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
        path: '/api/forgot-password',
        handler: 'actionPasswordController.forgotPassword',
        config: {
            policies: [],
            auth: false,
        },
    },
]