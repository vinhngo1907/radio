/**
 * setting service
 */

// import { Strapi } from "@strapi/strapi";
const { checkPermission } = require("../utils/checkPermission");
const checkAccountRoot = require("../utils/checkRoot");
const jwt = require("../utils/jwt");

const query = {
    fields: [
        "gg_api_key",
        "vbee_app_id",
        "level_location",
        "priority_mode",
        "vbee_token",
        "server_socket",
    ],
};

module.exports = ({ strapi }) => ({
    async find(ctx) {
        try {
            const response = strapi.entityService.findMany(
                "plugin::radio.setting",
                query
            );
            return response;
        } catch (error) {
            ctx.send({ message: error.message }, 400);
        }
    },
    async update(ctx) {
        try {
            const allow = await checkPermission(
                ctx,
                strapi,
                process.env.CAPACITY_SETTING
            );

            if (!allow) {
                throw new Error("You not allow update setting")
            }

            const response = await strapi.entityService.update("plugin::radio.setting", 1, {
                data: {
                    ...ctx.request.body
                }
            });

            return response

        } catch (error) {
            ctx.send({ message: error.message }, 400)
        }
    },
    async create(ctx) {
        try {
            // const token = ctx.request.headers.authorization;
            // const user = await jwt(token, strapi);
            const allow = await checkPermission(
                ctx,
                strapi,
                process.env.CAPACITY_CREATE_SETTING
            );

            // check Root
            // const checkRoot = checkAccountRoot(user);
            // if (!checkRoot) {
            //     return ctx.send({ message: "You don't have permission" }, 403);
            // }

            // Check permission
            if (!allow) {
                throw new Error("You not allow create setting")
            }            

            const response = await strapi.entityService.create("plugin::radio.setting", {
                data: {
                    ...ctx.request.body,
                    publishedAt: new Date()
                }
            });

            return response;
        } catch (error) {
            ctx.send({ message: error.message }, 400)
        }
    }
})