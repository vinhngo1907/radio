'use strict';

/**
 * media service
*/

const jwt = require("../utils/jwt");
const { checkPermission } = require("../utils/checkPermission");
const {
    roleLocationsMedia,
    roleLocationsDataMedia,
} = require("../utils/checkRoleLocations");
const TextToSpeech = require("../utils/text-to-speech");

const query = {
    fields: ["id", "status", "type", "name", "description", "createdAt", 'source'],
    filters: {
        $not: {
            publishedAt: null
        }
    },
    populate: {
        media: {
            fields: ["id", "name", "url", "size", "mime", "ext", "hash"],
        },
        user_created: {
            fields: ["id", "username", "first_name", "last_name", "phone_number"],
            populate: {
                locations: true,
            },
        },
    },
    sort: {
        createdAt: 'DESC'
    }
};

module.exports = ({ strapi }) => ({
    async find(ctx) {
        const complete = ctx.request.query.complete;
        const filters = complete
            ? {
                status: "complete",
                $not: {
                    publishedAt: null
                }
            }
            : {
                $not: {
                    publishedAt: null
                }
            };
        try {
            const page = Number(ctx.request.query.page) - 1 || 0;
            const limit = Number(ctx.request.query.limit) || 10;
            const response = await strapi.entityService.findMany(
                "plugin::radio.media",
                {
                    ...query,
                    filters,
                }
            );
            const res = await roleLocationsDataMedia(ctx, strapi, response);
            const data = res.slice(page * limit, page * limit + limit);
            return data;
        } catch (error) {
            ctx.send({ message: error.message }, 400);
        }
    },
    async findOne(ctx) {
        const params = ctx.request.params.id;
        const response = strapi.entityService.findOne(
            "plugin::radio.media",
            params,
            query
        );
        return response;
    },
    async create(ctx) {
        // Check roles
        const allow = await checkPermission(
            ctx,
            strapi,
            process.env.CAPACITY_CREATE_MEDIA
        );
        if (!allow) {
            ctx.send({ message: "You not allow create media", status: 403 }, 200);
            return;
        }
        //
        const { request } = ctx;
        const dataMedia = request.body;
        const name = request.body.name;
        const file = request.files;
        const uploadService = strapi.plugins.upload.services.upload;
        const token = ctx.request.headers.authorization;
        const user = await jwt(token, strapi);
        try {
            if (dataMedia.type == "text") {
                const res = await TextToSpeech(dataMedia);
                if (res.status == 200) {
                    const { type, description, name } = dataMedia;
                    const response = await strapi.entityService.create(
                        "plugin::radio.media",
                        {
                            data: {
                                type,
                                name,
                                description,
                                request_id_text_to_speech: res.request_id,
                                status: "pending",
                                user_created: [user.id],
                                publishedAt: new Date(),
                            },
                        }
                    );
                    return response;
                } else {
                    throw new Error("Text to speech error");
                }
            }

            if (dataMedia.type == "online") {
                const response = await strapi.entityService.create(
                    "plugin::radio.media",
                    {
                        data: {
                            ...dataMedia,
                            status: 'pending',
                            user_created: [user.id],
                            publishedAt: new Date(),
                        },
                    }
                );
                return response;
            }

            const data = {
                fileInfo: { name },
            };
            const resFile = await uploadService.upload({
                data,
                files: {
                    name,
                    buffer: true,
                    path: file.files.path,
                    type: file.files.type,
                    size: file.files.size,
                },
            });
            // if (res) {
            const response = await strapi.entityService.create("plugin::radio.media", {
                data: {
                    ...dataMedia,
                    status: "pending",
                    media: [resFile[0].id],
                    user_created: [user.id],
                    publishedAt: new Date(),
                },
            });
            return response;
        } catch (error) {
            return ctx.send({ message: error.message }, 400);
        }
    },
    async update(ctx) {
        const params = ctx.request.params.id;
        try {
            //Check role location
            const media = await strapi.entityService.findOne(
                "plugin::radio.media",
                params,
                query
            );

            const locationMedia = media.user_created.locations;
            const allowLocation = await roleLocationsMedia(
                ctx,
                strapi,
                locationMedia
            );

            if (allowLocation != true) {
                ctx.send({ message: "You not allow update media at location", status: 403 }, 200);
                return;
            }
            // Check roles
            const allow = await checkPermission(
                ctx,
                strapi,
                process.env.CAPACITY_UPDATE_MEDIA
            );

            if (!allow) {
                ctx.send({ message: "You don't alllow update media", status: 403 }, 200);
                return;
            }
            //Check permission active
            const active = ctx.request.body.status;
            if (active) {
                const allow = await checkPermission(
                    ctx,
                    strapi,
                    process.env.CAPACITY_ACTIVE_MEDIA
                );
                if (!allow) {
                    ctx.send({ message: "You not allow active media", status: 403 }, 200);
                    return;
                }
            }

            // if (ctx.request.files) {
            //   const file = ctx.request.files;
            //   const data = {
            //     fileInfo: { name },
            //   };
            //   const uploadService = strapi.plugins.upload.services.upload;
            //   const resFile = await uploadService.upload({
            //     data,
            //     files: {
            //       name,
            //       buffer: true,
            //       path: file.files.path,
            //       type: file.files.type,
            //       size: file.files.size,
            //     },
            //   });
            //   const response = await strapi.entityService.update(
            //     "plugin::radio.media",
            //     params,
            //     {
            //       data: {
            //         ...ctx.request.body,
            //         media: [resFile[0].id],
            //       },
            //     }
            //   );
            //   return response;
            // }
            //
            const response = await strapi.entityService.update(
                "plugin::radio.media",
                params,
                {
                    data: {
                        ...ctx.request.body,
                    },
                }
            );
            return response;
        } catch (error) {
            return ctx.send({ message: error.message }, 400);
        }
    },
    async delete(ctx) {
        const params = ctx.request.params.id;
        //Check role location
        const media = await strapi.entityService.findOne(
            "plugin::radio.media",
            params,
            query
        );
        const locationMedia = media.user_created.locations;
        const allowLocation = await roleLocationsMedia(
            ctx,
            strapi,
            locationMedia
        );
        if (allowLocation != true) {
            ctx.send({ message: "You not allow delete media at location", status: 403 }, 200);
            return;
        }
        // Check roles
        const allow = await checkPermission(
            ctx,
            strapi,
            process.env.CAPACITY_DELETE_MEDIA
        );
        if (!allow) {
            ctx.send({ message: "You don't allow delete media", status: 403 }, 200);
            return;
        }
        try {
            await strapi.entityService.update(
                "plugin::upload.file",
                media.media.id, {
                data: {
                    publishedAt: null
                }
            }
            );
            const response = await strapi.entityService.update(
                "plugin::radio.media",
                params, {
                data: {
                    publishedAt: null
                }
            }
            );
            return response;
        } catch (error) {
            return ctx.send({ message: error.message }, 400);
        }
    },
});