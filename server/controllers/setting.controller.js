module.exports = {
    async find(ctx) {
        try {
            return await strapi.plugin('radio').service("settingService").find(ctx);
        } catch (error) {
            ctx.throw(500, error);
        }
    },
    async update(ctx) {
        try {
            return await strapi.plugin('radio').service("settingService").update(ctx);
        } catch (error) {
            ctx.throw(500, error);
        }
    },
    async create(ctx) {
        try {
            return await strapi.plugin('radio').service("settingService").create(ctx);
        } catch (error) {
            ctx.throw(500, error);
        }
    }
}