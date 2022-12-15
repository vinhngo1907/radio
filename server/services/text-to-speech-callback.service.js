'use strict';

/**
 * text-to-speed-callback service
*/

const axios = require("axios");
const jwt = require("../utils/jwt");
const FormData = require("form-data");
const request = require("request");
const { getService } = require("@strapi/plugin-users-permissions/server/utils");

module.exports = ({ strapi }) => ({
    async create(ctx) {
        try {
            const { request_id, audio_link } = ctx.request.body;
            const formData = new FormData();
            formData.append("files", await request(audio_link));

            const media = await strapi.entityService.findMany("plugin::radio.media", {
                filters: {
                    request_id_text_to_speech: request_id,
                },
                populate: {
                    user_created: {
                        fields: ["id"],
                    },
                },
            });

            if (media.length == 0) {
                return ctx.send({ message: "Please upload some file text" }, 400);
            }

            const token = await getService("jwt").issue({
                id: media[0].user_created.id,
            });

            console.log(token);

            const resUploadFile = await axios({
                method: "POST",
                url: `${process.env.BASE_URL}/api/upload`,
                data: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log(resUploadFile);
            await strapi.entityService.update("plugin::radio.media", media[0].id, {
                data: {
                    media: [resUploadFile.data[0].id],
                },
            });
            const { user } = ctx.request;
            const response = await strapi.entityService.create(
                "plugin::radio.texttospeedcallback",
                {
                    data: {
                        ...ctx.request.body,
                        publishedAt: new Date(),
                        user_created: [user.id],
                    },
                }
            );
            return response;
        } catch (error) {
            // console.log(error);
            return ctx.send({ message: error.message }, 400);
        }
    },

    async find(ctx) {
        try {
            const response = await strapi.entityService.findMany("plugin::radio.texttospeedcallback", {
                data: {
                    ...ctx.request.body,
                    publishedAt: new Date()
                }
            });
            return response;
        } catch (error) {
            return ctx.send({ message: error.message }, 400);
        }
    }
})