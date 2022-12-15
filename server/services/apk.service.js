'use strict'

/**
 * update-apk controller
 */

const { checkPermission, getToken } = require("../utils/checkPermission");

const checkAccountRoot = require("../utils/checkRoot");
const jwt = require("../utils/jwt");

const query = {
    fields: ["type", "version"],
    populate: {
        file: {
            fields: ["id", "name", "url", "size", "mime", "ext", "hash"],
        },
        locations: {
            fields: ["id", "name", "slug"],
        },
    },
};

module.exports = ({ strapi }) => ({
    async find(ctx) {
        const response = strapi.entityService.findMany(
            "plugin::radio.updateapk",
            query
        );
        return response;
    },
    async create(ctx) {
        try {
            const { id, root } = ctx.request.user;

            if (root == "" || root == null) {
                return ctx.send({ message: "You dont't permission to update apk" }, 403);
            }

            const data = ctx.request;
            const body = data.body;
            if (body.type == 'url') {
                return success;
            }
            if (body.type == 'file') {
                const data = {
                    fileInfo: { name: body.version }
                }
                const file = ctx.request.files;

                const uploadService = strapi.plugins.upload.services.upload;

                const resFile = await uploadService.upload({
                    data,
                    files: {
                        name: body.version,
                        buffer: true,
                        path: file.files.path,
                        type: file.files.type,
                        size: file.files.size,
                    }
                });

                const response = await strapi.entityService.create("plugin::radio.updateapk", {
                    data: {
                        ...body,
                        file: [resFile[0].id],
                        publishedAt: new Date(),
                    },
                });
                return response;
            }

        } catch (error) {
            console.log(error);
            return ctx.send({ message: error.message }, 400);
        }
    }
});