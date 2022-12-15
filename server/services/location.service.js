'use strict';

/**
 * location service
 */

const { Strapi } = require('@strapi/strapi');
const { checkPermission } = require("../utils/checkPermission");
const { locationsParent } = require("../utils/checkRoleLocations");
const changeSlug = require("../utils/convertSlug");
const jwt = require('../utils/jwt');
const {
    checkExistLocationChild,
    checkExistLocationParent,
    checkLocationParent,
    locationChild,
    locationParent,
} = require('../utils/locations');

const query = {
    fields: ["id", "name", "slug", "createdAt"],
    populate: {
        location_parent: {
            fields: ["id", "name", "slug"],
        },
        user_created:{
            fields: ["email", "username", "first_name", "last_name"]
        }
    },
}

module.exports = ({strapi})=>({
    async find(ctx) {
        const deep = ctx.request.query.deep;
        const page = Number(ctx.request.query.page) - 1 || 0;
        const limit = Number(ctx.request.query.limit) || 10;
        if (deep) {
            if (deep == -1) {
                try {
                    const allLocation = await strapi.entityService.findMany(
                        "plugin::radio.location",
                        query
                    );
                    const allLocationParent = locationParent(allLocation);
                    const res = await locationsParent(ctx, strapi, allLocationParent);
                    const response = res.slice(page * limit, page * limit + limit);
                    return response;
                } catch (error) {
                    ctx.send({ message: "Not found location" }, 400);
                    return;
                }
            } else if (deep != -1) {
                try {
                    const response = await strapi.entityService.findMany(
                        "plugin::radio.location",
                        {
                            fields: ["id", "name", "slug"],
                            populate: {
                                location_parent: {
                                    fields: ["id", "name", "slug"],
                                },
                            },
                            filters: {
                                location_parent: {
                                    id: deep,
                                },
                            },
                        }
                    );
                    const res = response.filter(
                        (item) => item.id != item.location_parent.id
                    );
                    return res.slice(page * limit, page * limit + limit);
                } catch (error) {
                    ctx.send({ message: "Not found location" }, 400);
                    return;
                }
            } else {
                ctx.send({ message: "Not found location" }, 404);
            }
        } else {
            return ctx.send({ message: "Not found location" }, 404);
        }
    },
    //create location
    async create(ctx) {
        //data submit
        const bodyRequest = ctx.request.body.data;
        
        const token = ctx.request.headers.authorization;
        const user = await jwt(token, strapi);

        const data = bodyRequest.map((item) => {
            return {
                ...item,
                slug: changeSlug(item.name),
            };
        });
        // Check roles
        const allow = await checkPermission(
            ctx,
            strapi,
            process.env.CAPACITY_CREATE_LOCATION
        );
        if (!allow) {
            ctx.send({ message: "You not allow create location" }, 403);
            return;
        }
        //get all location
        const allLocation = await strapi.entityService.findMany(
            "plugin::radio.location",
            query
        );
        // ---- Only create location parent -----//////
        //all location parent
        const allLocationParent = locationParent(allLocation);
        // check is exist location parent
        const isExistLocationParent = checkExistLocationParent(
            data[0],
            allLocationParent
        );
        let message;
        let status;
        let response;

        for (let i = 0; i < data.length; i++) {
            if (i == 0) {
                // location parent
                if (!isExistLocationParent) {
                    const res = await strapi.entityService.create(
                        "plugin::radio.location",
                        {
                            data: {
                                ...data[0],
                                publishedAt: new Date(),
                                user_created: [user.id]
                            },
                        }
                    );
                    await strapi.entityService.update(
                        "plugin::radio.location",
                        res.id,
                        {
                            data: {
                                location_parent: [res.id],
                                user_created: [user.id]
                            },
                        }
                    );
                    response = res;
                    message = "Create location successfully";
                    status = 200;
                } else {
                    message = `Location ${data[i].name} is already exist`;
                    status = 409;
                }
            } else {
                // location child
                const allLocationParent = allLocation.filter((item) => {
                    // get all location parent if same slug
                    return item.slug == data[i - 1].slug;
                });
                const locationParent = allLocationParent.filter(
                    (item) => item.id == data[i].location_parent
                );
                if (locationParent.length >= 1) {
                    const allLocationChild = locationChild(
                        allLocation,
                        locationParent[0].id
                    ); // get all location child in parent
                    const isExistLocationChild = checkExistLocationChild(
                        allLocationChild,
                        data[i]
                    ); // check location child have exist
                    if (isExistLocationChild) {
                        message = `Location ${data[i].name} is already exits`;
                        status = 409;
                    } else {
                        const res = await strapi.entityService.create(
                            "plugin::radio.location",
                            {
                                data: {
                                    ...data[i],
                                    publishedAt: new Date(),
                                    user_created: [user.id]
                                },
                            }
                        );
                        response = res;
                        message = "Create location successfully";
                        status = 200;
                    }
                } else {
                    if (response == undefined) {
                        ctx.send({ message: "Somethings with wrong" }, 400);
                        return;
                    }
                    const res = await strapi.entityService.create(
                        "plugin::radio.location",
                        {
                            data: {
                                ...data[i],
                                location_parent: [response.id],
                                publishedAt: new Date(),
                                user_created: [user.id]
                            },
                        }
                    );
                    response = res;
                    message = "Create location successfully";
                    status = 200;
                }
            }
        }
        ctx.send({ message }, status);
    },
    // update role
    async update(ctx) {
        let message;
        let status;
        const { request, response } = ctx;
        const requestBody = request.body;
        const data = { ...requestBody, slug: changeSlug(request.body.name) };
        const params = request.params.id;
        // Check roles
        const allow = await checkPermission(
            ctx,
            strapi,
            process.env.CAPACITY_EDIT_LOCATION
        );
        if (!allow) return;
        //
        const allLocation = await strapi.entityService.findMany(
            "plugin::radio.location",
            query
        );
        const res = await strapi.entityService.findOne(
            "plugin::radio.location",
            params,
            query
        );
        if (res.location_parent == null) {
            const allLocationParent = locationParent(allLocation);
            // check is exist location parent
            const isExistLocationParent = checkExistLocationParent(
                data,
                allLocationParent
            );
            if (isExistLocationParent) {
                message = `Location ${data.name} is already exits`;
                status = 409;
            } else {
                console.log(params);
                await strapi.entityService.update("plugin::radio.location", params, {
                    data: {
                        ...data,
                    },
                });
                message = "Location update successfully";
                status = 200;
            }
        } else {
            const allLocationChild = locationChild(
                allLocation,
                res.location_parent.id
            );
            const exitsLocationChild = checkExistLocationChild(
                allLocationChild,
                data
            );
            if (exitsLocationChild) {
                message = `Location ${data.name} is already exits`;
                status = 409;
            } else {
                await strapi.entityService.update("plugin::radio.location", params, {
                    data: {
                        ...data,
                    },
                });
                message = "Location update successfully";
                status = 200;
            }
        }
        ctx.send({ message }, status);
    },
})