'use strict';
/**
 * capacity service
 */

// const { Strapi, factories } = require("@strapi/strapi");
const { checkPermission } = require("../utils/checkPermission");
const convertSlug = require('../utils/convertSlug');

module.exports = ({ strapi }) => ({
    async getall(ctx) {
        const response = await strapi.entityService.findMany("plugin::radio.capacity", {});
        return response;
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
        //

        const response = await strapi.entityService.create(
            "plugin::radio.capacity",
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
            "plugin::radio.capacity",
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
            "plugin::radio.capacity",
            params
        );
        return response;
    }
})