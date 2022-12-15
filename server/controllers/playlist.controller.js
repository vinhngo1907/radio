
module.exports = {
    async find(ctx) {
        try {
            return await strapi.plugin('radio').service("playlistService").find(ctx);
        } catch (err) {
            ctx.throw(500, err);
        }
    },
    async findOne(ctx) {
        try {
            return await strapi.plugin('radio').service("playlistService").findOne(ctx);
        } catch (err) {
            ctx.throw(500, err);
        }
    },
    async create(ctx) {
        try {
            return await strapi.plugin('radio').service('playlistService').create(ctx);
        } catch (err) {
            console.log(err);
            ctx.throw(500, err);
        }
    },
    async update(ctx) {
        try {
            return await strapi.plugin('radio').service("playlistService").update(ctx);
        } catch (err) {
            console.log(err);
            ctx.throw(500, err);
        }
    },
    async delete(ctx) {
        try {
            return await strapi.plugin('radio').service("playlistService").delete(ctx);
        } catch (err) {
            ctx.throw(500, err);
        }
    },
    
    async priority(ctx) {
        try {
            return await strapi.plugin('radio').service("playlistService").priority(ctx);
        } catch (err) {
            console.log(err);
            ctx.throw(500, err);
        }
    }
}