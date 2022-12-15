'use strict';

module.exports = {
    async getall(ctx){
        try{
            return await strapi.plugin('radio').service("roleSupportService").getall(ctx);
        }catch(err){
            ctx.throw(500, err);
        }
    },
    async create(ctx) {
        try {
            return await strapi.plugin('radio').service("roleSupportService").create(ctx);
        } catch (err) {
            ctx.throw(500, err);
        }
    },
    async update(ctx){
        try{
            return await strapi.plugin('radio').service("roleSupportService").update(ctx);
        }catch(err){
            ctx.throw(500, err);
        }
    },
    async delete(ctx){
        try{
            return await strapi.plugin('radio').service("roleSupportService").delete(ctx);
        }catch(err){
            ctx.throw(500, err);
        }
    }
};
