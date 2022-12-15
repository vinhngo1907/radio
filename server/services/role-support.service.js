'use strict';

const { checkPermission } = require('../utils/checkPermission');

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
        const allow = await checkPermission(
            ctx,
            strapi,
            process.env.CAPACITY_CREATE
        );
        if (!allow) return;

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
            process.env.CAPACITY_UPDATE
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
            process.env.CAPACITY_DELETE
        );
        if (!allow) return;

        const response = strapi.entityService.delete(
            "plugin::radio.rolesupport",
            params
        );
        return response;
    }
})