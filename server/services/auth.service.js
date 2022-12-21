'use strict';

const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = ({ strapi }) => ({
    async login(ctx) {
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

            const refreshToken = jsonwebtoken.sign({ id: user.id }, process.env.JWT_SECRET_REFRESH_TOKEN, { expiresIn: process.env.EXPIRED_REFRESH_TOKEN });

            ctx.cookies.set('refreshToken', refreshToken, {
                httpOnly: true,
                path: "/radio/api/token",
                maxAge: 1 * 24 * 60 * 60 * 1000,
                secure: process.env.NODE_ENV === "production" ? true : false,
            });

            return ctx.send({
                // jwt: getService("jwt").issue({ id: user.id }),
                jwt: token,
                user: user,
                // rf_token: refreshToken
            });
        } catch (error) {
            console.log(error);
            ctx.send({ message: error.message }, 401);
            return;
        }
    },
    async refreshToken(ctx) {
        try {
            // console.log(ctx.request.headers.cookie);
            const cookies = ctx.request.headers.cookie.split(";");
            const rf_token = cookies.find((item)=>item.startsWith("refreshToken"));
            // console.log(rf_token);
            if (!rf_token) {
                return ctx.send({ message: "Please login", status: 401 }, 200);
            }
            const rf_token_value = rf_token && rf_token.split("=")[1];
            const decoded = jsonwebtoken.verify(rf_token_value, process.env.JWT_SECRET_REFRESH_TOKEN);
            if (!decoded) {
                return ctx.send({ message: "Please login now", status: 401 }, 200);
            }

            const userId = decoded.id;
            const user = await strapi.entityService.findOne(
                "plugin::radio.user",
                userId, {
                fields: ["id", "username", "email", "first_name", "last_name"],
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
                }
            });
            if (!user) {
                return ctx.send({ message: "Unauthorized, please login now", status: 401 }, 200);
            }

            const access_token = jsonwebtoken.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRED_TOKEN });
            return ctx.send({
                jwt: access_token,
                user: user
            });
        } catch (error) {
            console.log(error);
            return ctx.send({ message: error.message }, 400);
        }
    }
});