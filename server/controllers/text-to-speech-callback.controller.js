/**
 * text-to-speed-callback controller
 */

module.exports = {
    async create(ctx) {
        try {
            return await strapi.plugin("radio").service("textToSpeechCallbackService").create(ctx);
        } catch (error) {
            ctx.throw(500, error);
        }
    },
    async find(ctx) {
        try {
            return await strapi.plugin("radio").service("textToSpeechCallbackService").find(ctx);
        } catch (error) {
            ctx.throw(500, error);
        }
    }
};