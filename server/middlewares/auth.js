'use strict';
const { Strapi } = require('@strapi/strapi');
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const { getService } = require("@strapi/plugin-users-permissions/server/utils");

const query = {
    fields: ["id", "username", "email", "root", "first_name", "last_name", "phone_number"],
    populate: {
        avatar: {},
        locations: { fields: ["id", "name"], },
        role_support: {
            fields: ["id", "name"],
            populate: {
                capacities: { fields: ["id", "name"] }
            }
        }
    }
}
async function auth(ctx, next) {
    try {
        const authHeader = ctx.request.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return ctx.send({ message: "Permission" }, 403);
        // console.log(token);

        // const decoded: any = jwt_decode(token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) return ctx.send({ message: "Permission" }, 403);

        // console.log(decoded);
        const userId = decoded.id;

        // const user = await strapi.query('plugin::radio.user').findOne({
        //     where: { id: userId }
        // });
        const user = await strapi.entityService.findOne("plugin::radio.user", userId, {
            ...query
        })
        // console.log(user);

        if (!user) return ctx.send({ message: "Unauthorized" }, 401);
        ctx.request.user = user;
        return next();
    } catch (error) {
        console.log(error);
        return ctx.send({ message: error.message }, 400);
    }
}

module.exports = auth;