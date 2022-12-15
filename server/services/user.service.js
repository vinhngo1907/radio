'use strict';

const { checkPermission, getToken } = require("../utils/checkPermission");
const jwt = require("../utils/jwt");
const jwt_decode = require("jwt-decode");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const query = {
    fields: ["username", "email", "first_name", "last_name", "phone_number", "blocked", "root"],
    populate: {
        locations: {
            fields: ["id", "name"],
        },
        avatar: {
        },
        role_support: {
            fields: ["id", "name"],
            populate: {
                capacities: {
                    fields: ["id", "name"],
                },
            },
        },
    },
};

module.exports = ({strapi}) =>({
    async update(ctx) {
        try {
            const data = ctx.request.body;
            const { id } = ctx.request.query;
            // update avatar
            if (ctx.request.files.avatar) {
                const file = ctx.request.files.avatar;
                const uploadService = strapi.plugins.upload.services.upload;
                const resFile = await uploadService.upload({
                    data: {
                        fileInfo: {
                            name: file.name,
                        },
                    },
                    files: {
                        name: file.name,
                        buffer: true,
                        path: file.path,
                        type: file.type,
                        size: file.size,
                    },
                });
                data.avatar = [resFile[0].id];
            }
            //

            if (data.locations) {
                data.locations = JSON.parse("[" + data.locations + "]");
            }
            if (data.role_support) {
                data.role_support = JSON.parse("[" + data.role_support + "]");
            }
            // Check roles
            const allow = await checkPermission(
                ctx,
                strapi,
                process.env.CAPACITY_EDIT_USER
            );
            const token = await getToken(ctx);
            const validateUser = await jwt(token, strapi);
            console.log(validateUser);
            if (id == validateUser.id && allow == false) {
                if (
                    data.first_name ||
                    data.phone_number ||
                    data.last_name ||
                    data.avatar ||
                    data.password
                ) {
                    const response = await strapi.entityService.update(
                        "plugin::radio.user",
                        id,
                        {
                            data: {
                                ...data,
                            },
                        }
                    );
                    return response;
                } else {
                    throw new Error(
                        "You only edit first name, last name and phone number"
                    );
                }
            }
            // Check roles
            if (!allow) throw new Error("You not allow edit user");

            const user = await strapi.entityService.findOne(
                "plugin::radio.user",
                id
            );
            if (user) {
                if (data.username || data.email) {
                    throw new Error(
                        "You not allow edit username and email of other user"
                    );
                } else {
                    const response = await strapi.entityService.update(
                        "plugin::radio.user",
                        id,
                        {
                            data: {
                                ...data,
                            },
                        }
                    );
                    return response;
                }
            } else {
                throw new Error("User not found");
            }
        } catch (error) {
            return ctx.send({ message: error.message }, 400);
        }
    },
    async find(ctx) {
        try {
            const response = await strapi.entityService.findMany(
                "plugin::radio.user",
                // { populate: '*' }
                { ...query }
            );
            return response;
        } catch (error) {
            console.log(error)
            return ctx.send({ message: error.message }, 400);
        }
    },
    async register(ctx) {
        // Check permission
        const allow = await checkPermission(
            ctx,
            strapi,
            process.env.CAPACITY_CREATE_USER
        );
        if (!allow) return;

        try {
            const { request } = ctx;
            const { username, email } = request.body
            const user = await strapi.query('plugin::radio.user').findOne({
                where: {
                    $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
                },
            });
            if (user) {
                throw new Error("Username or email already exist")
            }

            const data = {
                ...request.body,
                // avatar: [61]
            }

            const response = await strapi.entityService.create("plugin::radio.user", {
                data: {
                    ...data
                }
            });
            return { ...response, password: '' };
        } catch (error) {
            return ctx.send({ message: error.message }, 400);
        }
    },
    async getMe(ctx) {
        try {
            const token = ctx.request.headers.authorization.split(' ')[1];
            const decoded = jwt_decode(token);
            const userId = decoded.id;
            const user = await strapi.entityService.findOne('plugin::radio.user', userId, {
                ...query,
            });
            // delete user?.password;
            console.log(ctx.request.user);
            return user;
        } catch (error) {
            return ctx.send({ message: error.message }, 400);
        }
    },
    async login(ctx){
         //   const provider = ctx.params.provider || "local";
         const { identifier, password } = ctx.request.body;
         try {
             const user = await strapi.query('plugin::radio.user').findOne({
                 where: {
                     $or: [{ email: identifier.toLowerCase() }, { username: identifier.toLowerCase() }],
                 },
             });
 
             if (!user) {
                 throw new Error("Invalid identifier or password");
             }
             if (user.confirmed !== true) {
                 throw new Error("Your account email is not confirmed");
             }
             if (user.blocked === true) {
                 throw new Error("Your account has been blocked by an administrator");
             }
 
             const validPassword = await bcrypt.compare(password, user.password);
             if (!validPassword) {
                 throw new Error("Invalid identifier or password");
             }
             const token = jsonwebtoken.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRED_TOKEN });
             
             delete user?.password;
 
             return ctx.send({
                 // jwt: getService("jwt").issue({ id: user.id }),
                 jwt: token,
                 user: user,
             });
         } catch (error) {
             ctx.send({ message: error.message }, 401);
             return;
         }
    }
})