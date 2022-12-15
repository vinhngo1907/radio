module.exports = {
    async getall(ctx) {
        try {
            return await strapi.plugin('radio').service("deviceService").find(ctx);
        } catch (err) {
            ctx.throw(500, err);
        }
    },
    async findOne(ctx) {
        try {
            return await strapi.plugin('radio').service("deviceService").findOne(ctx);
        } catch (err) {
            ctx.throw(500, err);
        }
    },
    async create(ctx) {
        try {
            return await strapi.plugin('radio').service("deviceService").create(ctx);
        } catch (err) {
            ctx.throw(500, err);
        }
    },
    async update(ctx) {
        try {
            return await strapi.plugin('radio').service("deviceService").update(ctx);
        } catch (err) {
            ctx.throw(500, err);
        }
    },
    async delete(ctx) {
        try {
            return await strapi.plugin('radio').service("deviceService").delete(ctx);
        } catch (err) {
            ctx.throw(500, err);
        }
    },
}