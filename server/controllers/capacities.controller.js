'use strict';

module.exports = {
    async getall(ctx) {
        try {
            // return await strapi.plugin("radio").service("loginService").update(ctx);
            return await strapi.plugin('radio').service("capacitiesService").getall(ctx);
        } catch (err) {
            ctx.throw(500, err);
        }
    },
    async create(ctx) {
        try {
            return await strapi.plugin('radio').service('capacitiesService').create(ctx);
        } catch (err) {
            ctx.throw(500, err);
        }
    },
    async update(ctx) {
        try {
            return await strapi.plugin('radio').service("capacitiesService").update(ctx);
        } catch (err) {
            ctx.throw(500, err);
        }
    },
    async delete(ctx) {
        try {
            return await strapi.plugin('radio').service("capacitiesService").delete(ctx);
        } catch (err) {
            ctx.throw(500, err);
        }
    }
}