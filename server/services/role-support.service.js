'use strict';

const { getToken, checkPermission } = require('../utils/checkPermission');
const checkAccountRoot = require("../utils/checkRoot");
const jwt = require('../utils/jwt');

const query = {
    fields: ["name", "slug"],
    populate: {
        capacities: {
            fields: ["name", "slug"],
        },
    },
};


module.exports = ({ strapi }) => ({
    async getall(ctx) {
        try {
            const response = await strapi.entityService.findMany("plugin::radio.rolesupport", { ...query });
            return response;
        } catch (error) {
            console.log(error);
        }
    },
    async create(ctx) {
        const data = ctx.request.body;
        // Check permission
        const user = await jwt(getToken(ctx), strapi);
        
        //Check super admin
        const validRoot = await checkAccountRoot(user);
        // const root = checkAccountRoot()
        if (!validRoot) {
            return ctx.send({ message: "You not allow create role", status: 403 }, 200)
        };
        //
        const response = await strapi.entityService.create(
            "plugin::radio.rolesupport",
            {
                data: {
                    ...data,
                    publishedAt: new Date(),
                },
            }
        );
        return response;
    },
    async update(ctx) {
        const data = ctx.request.body;
        const params = ctx.request.params.id;
        // Check permission
        const allow = await checkPermission(
            ctx,
            strapi,
            process.env.CAPACITY_UPDATE_ROLE
        );
        if (!allow) return;

        const response = strapi.entityService.update(
            "plugin::radio.rolesupport",
            params,
            {
                data: {
                    ...data,
                },
            }
        );
        return response;
    },
    async delete(ctx) {
        const params = ctx.request.params.id;
        // Check permission
        const allow = await checkPermission(
            ctx,
            strapi,
            process.env.CAPACITY_DELETE_ROLE
        );
        if (!allow) return;

        const response = strapi.entityService.delete(
            "plugin::radio.rolesupport",
            params
        );
        return response;
    }
})