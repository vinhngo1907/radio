module.exports = {
    async find(ctx) {
        try {
            return await strapi.plugin('radio').service("mediaService").find(ctx);
        } catch (err) {
            ctx.throw(500, err);
        }
    },
    async findOne(ctx) {
        try {
            return await strapi.plugin('radio').service("mediaService").findOne(ctx);
        } catch (err) {
            ctx.throw(500, err);
        }
    },
    async create(ctx) {
        try {
            return await strapi.plugin('radio').service("mediaService").create(ctx);
        } catch (err) {
            ctx.throw(500, err);
        }
    },
    async update(ctx) {
        try {
            return await strapi.plugin('radio').service("mediaService").update(ctx);
        } catch (err) {
            ctx.throw(500, err);
        }
    },
    async delete(ctx) {
        try {
            return await strapi.plugin('radio').service("mediaService").delete(ctx);
        } catch (err) {
            ctx.throw(500, err);
        }
    }
}