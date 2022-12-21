module.exports = {
    async refreshToken(ctx) {
        try {
            return await strapi.plugin('radio').service("authService").refreshToken(ctx);
        } catch (err) {
            ctx.throw(500, err);
        }
    },
    async login(ctx){
        try {
            return await strapi.plugin('radio').service("authService").login(ctx);
        } catch (err) {
            ctx.throw(500, err);
        }
    }
}