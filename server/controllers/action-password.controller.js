'use strict';

module.exports = {
    async changePassword(ctx) {
        try {
            return await strapi.plugin('radio').service("actionPasswordService").changePassword(ctx);
        } catch (err) {
            ctx.throw(500, err);
        }
    },
    async forgotPassword(ctx) {
        try {
            return await strapi.plugin('radio').service('actionPasswordService').forgotPassword(ctx);
        } catch (err) {
            ctx.throw(500, err);
        }
    }
}