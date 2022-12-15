module.exports = {
    async update(ctx){
        try{
            return await strapi.plugin('radio').service("convertTextService").update(ctx);
        }catch(error){
            ctx.throw(500,error);
        }
    }
}