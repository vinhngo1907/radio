const checkAccountRoot = require("./checkRoot");
const jwt = require("./jwt");

const getToken = (ctx) => {
    return ctx.request.headers.authorization;
};

const checkPermission = async (ctx, strapi, capacity) => {
    const user = await jwt(getToken(ctx), strapi);
    //Check super admin
    const validRoot = await checkAccountRoot(user);
    if (validRoot) return true;

    const role = await strapi.entityService.findMany(
        "plugin::radio.rolesupport",
        {
            fields: ["name", "slug"],
            filters: {
                name: user.role_support?.name,
            },
            populate: {
                capacities: {
                    fields: ["name", "slug"],
                },
            },
        }
    );

    if (role.length == 0) {
        ctx.send({ error: "You not allow edit location" }, 401);
        return false;
    }
    const allow = role[0].capacities.some((item) => item.slug == capacity);
    if (allow) {
        return allow;
    }
    else {
        ctx.send({ error: "You not allow edit loccation" }, 401);
        return allow;
    }
};

module.exports = { checkPermission, getToken };
