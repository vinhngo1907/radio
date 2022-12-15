'use strict';

const jwt = require("../utils/jwt");
const bcrypt = require("bcrypt");
const randomPassword =require("../utils/randomPassword");
const sendEmalForgotPassword = require("../utils/sendMailForgotPassword");

const query = {
    fiedls: ['id', 'username', 'email', 'first_name', 'last_name'],
    populate:{
        locations: {
            fields: ["id", "name"],
        },
    }
}

module.exports = ({strapi})=>({
    async changePassword(ctx) {
        const { request } = ctx;
        const token = request.headers.authorization;
        const userToken = await jwt(token, strapi);

        try {
            const { email, passOld, passNew } = request.body;
            const user = await strapi.query('plugin::radio.user').findOne({
                where: {
                    $or: [{ email: email.toLowerCase() }],
                },
            });
            if (!user) {
                throw new Error("Invalid identifier or password");
            }
            if (userToken.id !== user.id) {
                throw new Error("You don't change password this account");
            }
            if (user.confirmed !== true) {
                throw new Error("Your account email is not confirmed");
            }
            if (user.blocked === true) {
                throw new Error("Your account has been blocked by an administrator");
            }
            // const validPassword = await getService("user").validatePassword(
            //     passOld,
            //     user.password
            // );
            const validPassword = await bcrypt.compare(passOld, user.password);

            if (!validPassword) {
                throw new Error("Invalid identifier or password");
            }

            const password = bcrypt.hashSync(passNew, 10);

            const response = await strapi
                .query("plugin::radio.user")
                .update({
                    where: { id: userToken.id },
                    data: { resetPasswordToken: null, password },
                });
            return response;
        } catch (error) {
            ctx.send({ message: error.message }, 400);
        }
    },
    async forgotPassword(ctx) {
        try {
            const { email } = ctx.request.body
            const user = await strapi.query('plugin::radio.user').findOne({
                where: {
                    $or: [{ email: email.toLowerCase() }],
                },
            });

            if (!user) {
                throw new Error("Invalid identifier or password");
            }
            // password new random
            const newPassword = randomPassword(6)
            
            //Send mail forgot password
            const responseMail = await sendEmalForgotPassword(email, newPassword)
            if (responseMail.status !== 200) {
                throw new Error("Error when send mail forgot password, action failure")
            }
            // hash password
            const password = bcrypt.hashSync(newPassword, 10);
            
            //update password new for user
            await strapi
                .query("plugin::radio.user")
                .update({
                    where: { id: user.id },
                    data: { resetPasswordToken: null, password },
                });

            return ctx.send({ message: responseMail.message }, 200)
        } catch (error) {
            ctx.send({ message: error.message }, 400)
        }
    }
})