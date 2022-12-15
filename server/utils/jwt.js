const jwt_decode = require("jwt-decode"); //npmpackage
const { getService } = require("@strapi/plugin-users-permissions/server/utils");

const jwt = async (token, strapi) => {
    const newToken = token.slice(7);
    const decoded = jwt_decode(newToken); //data is what you sent in.
    const userId = decoded.id;

    const user = await strapi.entityService.findOne(
        "plugin::radio.user",
        userId,
        {
            populate: ["role_support", "locations", "calendar_user"],
        }
    );
    return user;
};

module.exports =  jwt;
