module.exports = {
    async find(ctx){
        try {
            return await strapi.plugin("radio").service("apkService").find(ctx);
        } catch (error) {
            ctx.throw(500, error);
        }
    },
    async create(ctx){
        try{
            return await strapi.plugin("radio").service("apkService").create(ctx);
        }catch(error){
            ctx.throw(500, error);
        }
    },
    async update(ctx){
        try{
            return await strapi.plugin("radio").service("apkService").update(ctx);
        }catch(error){
            ctx.throw(500, error);
        }
    }
}