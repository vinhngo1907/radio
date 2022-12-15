'use strict';

module.exports = {
    async find(ctx) {
        try {
            return await strapi.plugin('radio').service("locationService").find(ctx);
        } catch (err) {
            ctx.throw(500, err);
        }
    },
    async create(ctx) {
        try {
            return await strapi.plugin('radio').service("locationService").create(ctx);
        } catch (err) {
            ctx.throw(500, err);
        }
    },
    async update(ctx) {
        try {
            return await strapi.plugin('radio').service("locationService").update(ctx);
        } catch (err) {
            ctx.throw(500, err);
        }
    },
    async delete(ctx) {
        try {
            return await strapi.plugin('radio').service("locationService").delete(ctx);
        } catch (err) {
            ctx.throw(500, err);
        }
    }
}