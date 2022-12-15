const auth = require("../middlewares/auth");
const userRouter = require("./user.routing");
const actionPasswordRouter = require("./action-password.routing");
const roleSupportRouter = require("./role-support.routing");
const capacitiesRouter = require("./capacities.routing");
const locationRouter = require("./location.routing");
const deviceRouter = require("./device.routing");
const apkRouter = require("./apk.routing");
const settingRouter = require("./setting.routing");
const textToSpeedCallbackRouter = require("./text-to-speed-callback.routing");
const convertTextRouter = require("./convert-text.routing");
const mediaRouter = require("./media.routing");

module.exports = [
    // test route
    {
        method: 'GET',
        path: '/',
        handler: 'myController.index',
        config: {
            policies: [],
            auth: false,
            middlewares: [
                (ctx, next) => {
                    return auth(ctx, next)
                }
            ]
        },
    },
    // user
    ...userRouter,

    // action password
    ...actionPasswordRouter,

    // role -support
    ...roleSupportRouter,

    // capacities
    ...capacitiesRouter,

    // location
    ...locationRouter,

    // device
    ...deviceRouter,

    // apk
    ...apkRouter,

    // setting
    ...settingRouter,

    // text to speed callback
    ...textToSpeedCallbackRouter,

    // convert text
    ...convertTextRouter,

    // media
    ...mediaRouter
];
