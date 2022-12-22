/**
 * playlist service
 */

const { Strapi } = require("@strapi/strapi");
// const checkPlaylistFromCountry =require("../utils/checkPlaylistFromCountry");
const { checkPermission } = require("../utils/checkPermission");
const { checkPriority, getDataPriority } = require("../utils/checkPlaylistExistPriority");
const {
    roleLocationFindPlaylist,
    roleLocations,
    roleLocationsCreate,
} = require("../utils/checkRoleLocations");
const checkUpdatePlaylist = require("../utils/checkUpdatePlaylist");
const { checkCalendarUser } = require("../utils/createCalendar");
const deletePlaylistExits = require("../utils/deletePlaylistExist");

const { createPlaylistHook, deletePlaylistHook } = require("../utils/hook");
const jwt = require("../utils/jwt");
const {
    repeatDayInWeek,
    repeatDateInMonth,
    createPlaylist,
    updateHaveRepeat,
} = require("../utils/playlist");

const query = {
    fields: [
        "id",
        "playlist_name",
        "status",
        "priority",
        "date",
        "time_start",
        "time_end",
        "type",
        "repeat",
        "note",
        "createdAt"
    ],
    filters: {
        $not: {
            publishedAt: null
        }
    },
    populate: {
        media: {
            fields: ["id", "status", "name", "type", "description", "source"],
            populate: {
                media: {
                    fields: ["id", "name", "url", "size", "mime", "ext", "hash"],
                },
            },
        },
        locations: {
            fields: ["id", "name", "slug"],
        },
        repeat_schedule: true,
        playlists_exist: {
            filters: {
                $not: {
                    publishedAt: null
                }
            }
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

module.exports = ({ strapi }) => (
    {
        async find(ctx) {
            const page = Number(ctx.request.query.page) - 1 || 0;
            const limit = Number(ctx.request.query.limit) || 10;
            const response = await strapi.entityService.findMany(
                "plugin::radio.playlist",
                {
                    ...query,
                }
            );
            // const res = await roleLocationsData(ctx, strapi, response); // only result playlist in location child
            const res = await roleLocationFindPlaylist(ctx, strapi, response);
            const data = res.slice(page * limit, page * limit + limit);
            return data;
        },
        async findOne(ctx) {
            const params = ctx.request.params.id;
            const response = strapi.entityService.findOne(
                "plugin::radio.playlist",
                params,
                query
            );
            return response;
        },

        async create(ctx) {
            const { request, response } = ctx;
            const rq = request.body;
            const user = await jwt(request.headers.authorization, strapi)
            const data = {
                ...rq,
                user_created: [user.id]
            }

            const repeatSchedule = request.body.repeat_schedule;
            // ctx.send({ message: res.message }, res.status)
            // return
            //Check role location
            const allowLocation = await roleLocationsCreate(ctx, strapi);
            if (allowLocation != true) {
                ctx.send({ message: "You not allow create playlist at location", status: 403 }, 200);
                return;
            }
            // Check roles
            const allow = await checkPermission(
                ctx,
                strapi,
                process.env.CAPACITY_CREATE_PLAYLIST
            );
            if (!allow) {
                ctx.send({ message: "You don't allow create device", status: 403 }, 200);
                return;
            }

            const resCalendar = await checkCalendarUser(data, user, strapi)

            // return

            if (resCalendar.status == 400) {
                ctx.send({ message: "Have are playlist in this time create", status: 409 }, 200)
                return
            }

            if (resCalendar.status == 404) {
                ctx.send({ message: resCalendar.message, status: 403 }, 200)
                return
            }
            if (resCalendar.status == 409) {
                ctx.send({ message: resCalendar.message, status: 404 }, 200)
                return
            }
            if (data.repeat == "no" || data.repeat == "every_day") {
                const res = await strapi.service("plugin::radio.playlist").create({
                    data: {
                        ...data,
                        status: "pending",
                        playlists_exist: resCalendar.resId,
                        note: resCalendar.message
                    },
                });
                return res;
            } else if (data.repeat == "day_in_week") {
                const repeat = repeatDayInWeek(repeatSchedule);
                const res = createPlaylist(strapi, data, repeat, resCalendar);
                return res;
            } else if (data.repeat == "date_in_month") {
                const repeat = repeatDateInMonth(repeatSchedule);
                const res = createPlaylist(strapi, data, repeat, resCalendar);
                return res;
            } else {
                return ctx.send({ message: "Some error please try again", status: 400 }, 200);
            }
        },

        async update(ctx) {
            const { request } = ctx;
            const params = request.params.id;
            const token = request.headers.authorization
            //Check role location
            const allowLocation = await roleLocations(
                ctx,
                strapi,
                params,
                "plugin::radio.playlist"
            );
            if (allowLocation != true) {
                ctx.send({ message: "You not allow update playlist at location", status: 403 }, 200);
                return;
            }
            // Check roles
            const allow = await checkPermission(
                ctx,
                strapi,
                process.env.CAPACITY_UPDATE_PLAYLIST
            );
            if (!allow) {
                ctx.send({ message: "You don't allow update playlist", status: 403 }, 200);
                return;
            }
            //Check permission active
            const active = ctx.request.body.status;
            if (active) {
                const allow = await checkPermission(
                    ctx,
                    strapi,
                    process.env.CAPACITY_ACTIVE_PLAYLIST
                );
                if (!allow) {
                    ctx.send({ message: "You don't allow active playlist", status: 403 }, 200);
                    return;
                }
                const deletePlaylist = await deletePlaylistExits(params, ctx)
            }
            //
            const data = await strapi.entityService.findOne(
                "plugin::radio.playlist",
                params,
                {
                    populate: {
                        repeat_schedule: true,
                        locations: true
                    },
                }
            );
            //check update playlist have time exits
            const exist = await checkUpdatePlaylist(request.body, data, token, params)

            if (exist) {
                ctx.send({ message: "Have are playlist exist in time", status: 409 }, 200);
                return;
            }
            //case 1
            if (!request.body.repeat && !request.body.repeat_schedule) {
                const res = await strapi.entityService.update(
                    "plugin::radio.playlist",
                    params,
                    {
                        data: {
                            ...request.body,
                        },
                    }
                );
                const response = await createPlaylistHook(params, strapi, ctx);
                return response;
            }
            //case 2
            if (request.body.repeat) {
                const res = await updateHaveRepeat(
                    request,
                    data,
                    request.body,
                    strapi,
                    params
                );
                console.log(res)
                const response = await createPlaylistHook(params, strapi, ctx);
                return response;
            }
            ctx.send(
                { message: "Field type repeat is requied, please try again", status: 400 },
                200
            );
        },
        async delete(ctx) {
            try {
                const params = ctx.request.params.id;
                const allowLocation = await roleLocations(
                    ctx,
                    strapi,
                    params,
                    "plugin::radio.playlist"
                );
                if (allowLocation != true) {
                    ctx.send({ message: "You not allow delete playlist at location", status: 403 }, 200);
                    return;
                }
                // Check permission
                const allow = await checkPermission(
                    ctx,
                    strapi,
                    process.env.CAPACITY_DELETE_PLAYLIST
                );
                if (!allow) {
                    ctx.send({ message: "You don't allow delete playlist", status: 403 }, 200);
                    return;
                }
                //
                const res = await deletePlaylistHook(ctx, [ctx.request.params.id])
                if (res.status == 200) {
                    const response = strapi.entityService.update(
                        "plugin::radio.playlist",
                        params, {
                        data: {
                            publishedAt: null
                        }
                    }
                    );
                    return response;
                } else {
                    ctx.send({ message: res.message }, res.status)
                }
            } catch (error) {
                ctx.send({ message: error.message }, 400)
            }
        },

        async priority(ctx) {
            try {
                const { locations, media, all_location } = ctx.request.body
                const token = ctx.request.headers.authorization
                const options = {
                    locale: "Asia_Ho_Chi_Minh"
                }

                const timesTampStart = Number(new Date().getTime().toLocaleString("vi-VN", options).split(".").join(""))
                const timesTampEnd = Number(new Date().getTime().toLocaleString("vi-VN", options).split(".").join("")) + 30 * 60 * 1000
                const data = {
                    timesTampStart,
                    timesTampEnd,
                    locations,
                    media,
                    token
                }
                const allow = await checkPriority(data)
                if (!allow) {
                    throw new Error("Have playlist from country or district in this time")
                }
                const response = await getDataPriority(data, all_location)
                return response
            } catch (error) {
                ctx.send({ message: error.message }, 409)
            }
        }
    }
);
