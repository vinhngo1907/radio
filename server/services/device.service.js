/**
 * device services
 */
const { Strapi } = require("@strapi/strapi");
const { checkPermission } = require("..//utils/checkPermission");
const { createDeviceKeyHook } = require("../utils/hook");
// const locationSchema = require("../models/locations.model");
const { Locations } = require("../entities/location.entity");
const AppDataSource = require("../database");

const {
    roleLocations,
    roleLocationsCreate,
    roleLocationsData,
} = require("../utils/checkRoleLocations");
const jwt = require("../utils/jwt");
const deleteDeviceHook = require("../utils/deleteDeviceHook");

const query = {
    fields: [
        "device_name",
        "status",
        "device_id",
        "device_model",
        "meta",
        "device_key",
        "phone_number",
        "createdAt"
    ],
    filters: {
        $not: {
            publishedAt: null
        }
    },
    populate: {
        locations: {
            fields: ["id", "name"],
        },
        user_created: {
            fields: ["username", "first_name", "last_name", "phone_number"]
        }
    },
};

module.exports=({strapi})=>({
    async find(ctx) {
        try {
            const page = Number(ctx.request.query.page) - 1 || 0;
            const limit = Number(ctx.request.query.limit) || 10;
            const response = await strapi.entityService.findMany(
                "plugin::radio.device",
                { ...query }
            );
            // get locations
            // const locationsDevices = await locationSchema.find()
            const Entry = AppDataSource.getRepository(Locations);
            const locationsDevices = await Entry.find()
            //
            const res = await roleLocationsData(ctx, strapi, response);
            const data = res.slice(page * limit, page * limit + limit);
            const newDataHaveLocations = []
            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < locationsDevices.length; j++) {
                    if (data[i].device_id == locationsDevices[j].deviceId) {
                        newDataHaveLocations.push({ ...data[i], lng: locationsDevices[j].lng, lat: locationsDevices[j].lat })
                        break
                    }
                }
                newDataHaveLocations.push({ ...data[i], lng: null, lat: null })
            }
            console.log(newDataHaveLocations);
            return newDataHaveLocations;
        } catch (error) {
            ctx.send({ message: error.message }, 400);
        }
    },
    async findOne(ctx) {
        const params = ctx.request.params.id;
        const { locations } = ctx.request.query;

        if (locations) {
            const response = await strapi.db.query("plugin::radio.device").findOne({
                where: {
                    id: params
                },
                populate: ["locations"]
            })
            const arrLocation = []
            response.locations.forEach(item => arrLocation.push(item.id))
            const playlist = await strapi.db.query("plugin::radio.playlist").findMany({
                where: {
                    locations: arrLocation
                },
                populate: ["media", "locations"]
            })
            return playlist
        }


        const response = await strapi.entityService.findOne(
            "plugin::radio.device",
            params,
            query
        );
        return response;
    },
    async create(ctx) {
        const { request, response } = ctx;
        const data = { ...request.body };
        const token = ctx.request.headers.authorization
        // Check role location create
        const allowCreate = await roleLocationsCreate(ctx, strapi);

        if (allowCreate != true) {
            ctx.send({ message: "You don't allow create device at location", status: 401 }, 200);
            return;
        }

        // Check roles
        const allow = await checkPermission(
            ctx,
            strapi,
            process.env.CAPACITY_CREATE
        );
        if (!allow) {
            ctx.send({ message: "You not allow create device", status: 403 }, 200);
            return;
        }

        const checkDevice = await strapi.query("plugin::radio.device").findOne({
            where: {
                $not: {
                    publishedAt: null
                },
                device_id: data.device_id
            }
        });

        // check device
        if (checkDevice) {
            ctx.send({ message: "This device is already exist", status: 409 }, 200);
            return;
        }

        //
        const user = await jwt(token, strapi)
        try {
            const resCreate = await strapi.entityService.create(
                "plugin::radio.device",
                {
                    data: {
                        ...data,
                        status: "pending",
                        publishedAt: new Date(),
                        user_created: [user.id]
                        // roles,
                    },
                });
            return resCreate;
        } catch (error) {
            return ctx.send({ message: error.message }, 400);
        }
    },
    async update(ctx) {
        const { request, response } = ctx;
        const params = request.params.id;
        // const roles = request.body.roles;
        //Check role locations
        const allowRoleLocation = await roleLocations(
            ctx,
            strapi,
            params,
            "plugin::radio.device"
        );
        if (allowRoleLocation != true) {
            ctx.send({ message: "You don't allow update device at location", status: 403 }, 200);
            return;
        }
        // Check roles
        const allow = await checkPermission(
            ctx,
            strapi,
            process.env.CAPACITY_UPDATE
        );
        if (!allow) {
            ctx.send({ message: "You not allow update device", status: 403 }, 200);
            return;
        }
        //check permission active
        const active = request.body.status;
        if (active) {
            const allow = await checkPermission(
                ctx,
                strapi,
                process.env.CAPACITY_ACTIVE
            );
            if (!allow) {
                ctx.send({ message: "You not allow active device", status: 403 }, 200);
                return;
            }
        }

        try {
            const resUpdate = await strapi.entityService.update(
                "plugin::radio.device",
                params,
                {
                    data: {
                        ...request.body,
                    },
                }
            );
            const res = await createDeviceKeyHook(params, strapi, ctx);
            if (res.status == 200) {
                return resUpdate;
            } else {
                await strapi.entityService.update("plugin::radio.device", params, {
                    data: {
                        status: "pending",
                    },
                });
                throw new Error(res.message);
            }
        } catch (error) {
            console.log(error);
            return ctx.send({ message: error.message }, 400);
        }
    },
    async delete(ctx) {
        const params = ctx.request.params.id;
        //Check role locations
        const allowRoleLocation = await roleLocations(
            ctx,
            strapi,
            params,
            "plugin::radio.device"
        );
        if (allowRoleLocation != true) {
            ctx.send({ message: "You don't allow delete device at location", status: 403 }, 200);
            return;
        }
        // Check permission
        const allow = await checkPermission(
            ctx,
            strapi,
            process.env.CAPACITY_DELETE
        );
        
        if (!allow) {
            ctx.send({ message: "You not allow delete device", status: 403 }, 200);
            return;
        }
        //
        const response = strapi.entityService.update(
            "plugin::radio.device",
            params, {
            data: {
                publishedAt: null
            }
        });
        
        //Hook delete device on socket
        await deleteDeviceHook(response)
        return response;
    },
})