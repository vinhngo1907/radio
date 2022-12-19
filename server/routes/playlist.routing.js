const auth = require("../middlewares/auth");

module.exports = [
    {
        method: 'GET',
        path: '/api/playlists',
        handler: 'playlistController.find',
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
        path: '/api/playlists/:id',
        handler: 'playlistController.findOne',
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
        path: '/api/playlists',
        handler: 'playlistController.create',
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
        path: '/api/playlists/:id',
        handler: 'playlistController.update',
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
        path: '/api/playlists/:id',
        handler: 'playlistController.delete',
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
        path: '/api/play-priority',
        handler: 'playlistController.priority',
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