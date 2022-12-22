'use strict';

const jwt = require("jsonwebtoken");
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
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRED_TOKEN });

            delete user?.password;

            const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET_REFRESH_TOKEN, { expiresIn: process.env.EXPIRED_REFRESH_TOKEN })

            const endcode = jwt.sign({ refreshToken }, process.env.JWT_SECRET_ENDCODE, { expiresIn: process.env.EXPIRED_REFRESH_TOKEN })

            // ctx.cookies.set('refreshToken', refreshToken, {
            //     httpOnly: true,
            //     path: "/radio/api/token",
            //     maxAge: 1 * 24 * 60 * 60 * 1000,
            //     secure: process.env.NODE_ENV === "production" ? true : false,
            // });

            return ctx.send({
                // jwt: getService("jwt").issue({ id: user.id }),
                jwt: token,
                refreshToken: endcode,
                user: user,
            });
        } catch (error) {
            console.log(error);
            ctx.send({ message: error.message }, 401);
            return;
        }
    },
    async refreshToken(ctx) {
        try {
            const refreshToken = ctx.request.headers.jwt
            if (refreshToken) {
                const decode = jwt.verify(refreshToken, process.env.JWT_SECRET_ENDCODE)
                if (!decode) {
                    return ctx.send({ message: "Please login now", status: 401 }, 200);
                }
                const token = jwt.verify(decode.refreshToken, process.env.JWT_SECRET_REFRESH_TOKEN)
                if (token) {
                    return ctx.send({
                        // jwt: getService("jwt").issue({ id: token.id }),
                        jwt: jwt.sign({ id: token.id }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRED_TOKEN })
                    });
                }
            } else {
                return ctx.send({ message: "Please login", status: 401 }, 200);
            }

            // console.log(ctx.request.headers.cookie);
            // const cookies = ctx.request.headers.cookie.split(";");
            // const rf_token = cookies.find((item) => item.startsWith("refreshToken"));
            // if (!rf_token) {
            //     return ctx.send({ message: "Please login", status: 401 }, 200);
            // }

            // const rf_token_value = rf_token && rf_token.split("=")[1];
            // const decoded = jwt.verify(rf_token_value, process.env.JWT_SECRET_REFRESH_TOKEN);
            // if (!decoded) {
            //     return ctx.send({ message: "Please login now", status: 401 }, 200);
            // }

            // const userId = decoded.id;
            // const user = await strapi.entityService.findOne(
            //     "plugin::radio.user",
            //     userId, {
            //     fields: ["id", "username", "email", "first_name", "last_name"],
            //     populate: {
            //         locations: {
            //             fields: ["id", "name"],
            //         },
            //         avatar: {
            //         },
            //         role_support: {
            //             fields: ["id", "name"],
            //             populate: {
            //                 capacities: {
            //                     fields: ["id", "name"],
            //                 },
            //             },
            //         },
            //     }
            // });
            // if (!user) {
            //     return ctx.send({ message: "Unauthorized, please login now", status: 401 }, 200);
            // }

            // const access_token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRED_TOKEN });
            // return ctx.send({
            //     jwt: access_token,
            //     user: user
            // });
        } catch (error) {
            console.log(error);
            return ctx.send({ message: error.message }, 400);
        }
    }
});