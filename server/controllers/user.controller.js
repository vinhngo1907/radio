'use strict';

module.exports = {
    async update(ctx) {
        try {
            return await strapi.plugin('radio').service("userService").update(ctx);
        } catch (err) {
            ctx.throw(500, err);
        }
    },
    async find(ctx){
        try{
            return await strapi.plugin('radio').service("userService").find(ctx);
        }catch(err){
            ctx.throw(500, err);
        }
    },
    async register(ctx){
        try{
            return await strapi.plugin('radio').service("userService").register(ctx);
        }catch(err){
            ctx.throw(500, err);
        }
    },
    async getMe(ctx){
        try{
            return await strapi.plugin('radio').service("userService").getMe(ctx);
        }catch(err){
            ctx.throw(500, err);
        }
    },
}
