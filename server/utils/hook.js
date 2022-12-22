'use strict';

const axios = require("axios");

const createDeviceKeyHook = async (params, strapi, ctx) => {
    const token = ctx.request.headers.authorization;
    const data = await strapi.entityService.findOne("plugin::radio.device", params);

    if (data.status != "active") {
        throw new Error("Error with somethings");
    }
    const dataSubmit = {
        deviceId: data.device_id,
        deviceKey: data.device_key,
    };
    try {
        console.log("success");
        const response = await axios.post(
            `${process.env.URL_BASE_SOCKET}/api/v1/device/send-create-device-key`,
            dataSubmit,
            {
                headers: {
                    Authorization: token,
                },
            }
        );
        if (response.status == 200) {
            return {
                status: 200,
                message: "Succuess",
            };
        } else {
            throw new Error("Failure");
        }
    } catch (error) {
        return {
            status: 400,
            message: error,
        };
    }
    //   return { status: 200, message: "successs" };
};

const query = {
    populate: {
        repeat_schedule: true,
        locations: true,
        media: {
            populate: {
                media: true,
            },
        },
    },
};

const createPlaylistHook = async (params, strapi, ctx) => {
    try {
        const token = ctx.request.headers.authorization;
        const playlist = await strapi.entityService.findOne(
            "plugin::radio.playlist",
            params,
            query
        );
        if (playlist.status == "pending") {
            return;
        }

        // await deletePlaylistHook(ctx, [playlist.id])

        const devices = await strapi.entityService.findMany("plugin::radio.device", {
            populate: {
                locations: true,
            },
            filters: {
                $not: {
                    publishedAt: null
                }
            }
        });
        //List media of device
        const listMedia = [];
        if (playlist.type == "online") {
            playlist.media.forEach((item) => {
                listMedia.push({
                    url: item.source,
                    size: 0,
                });
            });
        } else if (playlist.type == "mp3") {
            playlist.media.forEach((item) => {
                listMedia.push({
                    url: `${process.env.BASE_URL}${item.media.url}`,
                    size: Number((item.media.size * 1024).toFixed(0)),
                });
            });
        }

        // Location
        const listLocationPlaylist = [];
        const listDevicesId = [];
        playlist.locations.forEach((item) => {
            listLocationPlaylist.push(item.id);
        });

        if (playlist.all_location == true) {
            devices.forEach((item) => {
                const listLocationDepend = []
                const listLocationDevice = [];
                const length = listLocationPlaylist.length
                for (let i = 0; i < length; i++) {
                    if (item.locations[i]?.id) {
                        listLocationDepend.push(item.locations[i].id)
                    }
                }
                item.locations.forEach((elem) => {
                    listLocationDevice.push(elem.id);
                });
                if (
                    JSON.stringify(listLocationDepend) ==
                    JSON.stringify(listLocationPlaylist) && listLocationDevice.length > length
                ) {
                    listDevicesId.push({ deviceId: item.device_id });
                }
            });
        } else {
            devices.forEach((item) => {
                const listLocationDevice = [];
                item.locations.forEach((elem) => {
                    listLocationDevice.push(elem.id);
                });
                if (
                    JSON.stringify(listLocationDevice) ==
                    JSON.stringify(listLocationPlaylist)
                ) {
                    listDevicesId.push({ deviceId: item.device_id });
                }
            });
        }

        const dataSubmit = {
            listDevice: listDevicesId,
            playlist: {
                ...playlist,
                listMedia: listMedia,
            },
        };

        console.log("Data Submit =>>>>>>>>>", dataSubmit)

        const response = await axios.post(
            `${process.env.URL_BASE_SOCKET}/api/v1/schedule/send-create-schedule`,
            dataSubmit,
            {
                headers: {
                    Authorization: token,
                },
            }
        );
        return response.data;
    } catch (error) {
        return error;
    }
};

const deletePlaylistHook = async (ctx, playlistId) => {
    try {
        const token = ctx.request.headers.authorization;
        console.log(token)
        // const id = ctx.request.params.id;
        const id = JSON.stringify(playlistId)
        const res = await axios.delete(
            `${process.env.URL_BASE_SOCKET}/api/v1/schedule/send-delete-schedule/${id}`,
            {
                headers: {
                    Authorization: token,
                },
            }
        );
        return {
            status: 200,
            message: res.data
        };
    } catch (error) {
        return {
            status: 400,
            message: error.message
        }
    }
}

module.exports = { createDeviceKeyHook, createPlaylistHook, deletePlaylistHook };