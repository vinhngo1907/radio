'use strict';
// import { async } from "node-stream-zip";
const checkAccountRoot = require("./checkRoot");
const jwt = require("./jwt");
const { getService } = require("@strapi/plugin-users-permissions/server/utils");

const roleLocations = async (ctx, strapi, params, model) => {
    const token = ctx.request.headers.authorization;
    const user = await jwt(token, strapi);
    try {
        //Check super admin
        const validRoot = await checkAccountRoot(user);
        if (validRoot) return true;
        //
        const data = await strapi.entityService.findOne(model, params, {
            populate: {
                locations: true,
            },
        });
        const locationsDevice = data?.locations;
        const locationsUser = user?.locations;
        // Check locations
        if (
            locationsUser.length == 1 &&
            locationsUser[0].id == locationsDevice[0].id &&
            locationsDevice.length > 0
        ) {
            return true;
        } else if (locationsUser.length > 1) {
            if (locationsUser[0].id == locationsDevice[0].id) {
                const idLocationParent = locationsUser[locationsUser.length - 1].id;
                for (let i = 0; i < locationsDevice.length; i++) {
                    if (
                        idLocationParent == locationsDevice[i].id &&
                        locationsUser.length - 1 == i
                    ) {
                        return true;
                    }
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
};

const roleLocationsCreate = async (ctx, strapi) => {
    const token = ctx.request.headers.authorization;
    const user = await jwt(token, strapi);
    try {
        //Check super admin
        const validRoot = await checkAccountRoot(user);
        if (validRoot) return true;
        //
        const device = ctx.request.body;
        const locationsDevice = device?.locations;
        const locationsUser = user?.locations;
        // Check locations
        if (
            locationsUser.length == 1 &&
            locationsUser[0].id == locationsDevice[0] &&
            locationsDevice.length > 0
        ) {
            return true;
        } else if (locationsUser.length > 1) {
            if (locationsUser[0].id == locationsDevice[0]) {
                const idLocationParent = locationsUser[locationsUser.length - 1].id;
                for (let i = 0; i < locationsDevice.length; i++) {
                    if (
                        idLocationParent == locationsDevice[i] &&
                        locationsUser.length - 1 == i
                    ) {
                        return true;
                    }
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
};

const roleLocationsMedia = async (ctx, strapi, locationMedia) => {
    const token = ctx.request.headers.authorization;
    const user = await jwt(token, strapi);
    try {
        //Check super admin
        const validRoot = await checkAccountRoot(user);
        if (validRoot) return true;
        //
        const locationsUser = user?.locations;
        // Check locations
        if (
            locationsUser.length == 1 &&
            locationsUser[0].id == locationMedia[0].id &&
            locationMedia.length > 0
        ) {
            return true;
        } else if (locationsUser.length > 1) {
            if (locationsUser[0].id == locationMedia[0].id) {
                const idLocationParent = locationsUser[locationsUser.length - 1].id;
                for (let i = 0; i < locationMedia.length; i++) {
                    if (
                        idLocationParent == locationMedia[i].id &&
                        locationsUser.length - 1 == i
                    ) {
                        return true;
                    }
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
};

const roleLocationsDataMedia = async (ctx, strapi, data) => {
    try {
        const token = ctx.request.headers.authorization;
        const user = await jwt(token, strapi);
        //Check super admin
        const validRoot = await checkAccountRoot(user);
        if (validRoot) return data;
        //
        const locationsUser = user?.locations;
        const idLocationParent = locationsUser[locationsUser.length - 1].id;
        const dataRes = [];
        data.forEach((item) => {
            const locations = item?.user_created?.locations || [];
            locations.forEach((elem, index) => {
                if (idLocationParent == elem.id && locationsUser.length - 1 == index) {
                    dataRes.push(item);
                }
            });
        });
        return dataRes;
    } catch (error) {
        return error;
    }
};

const roleLocationFindPlaylist = async (ctx, strapi, data) => {
    try {
        const token = ctx.request.headers.authorization;
        const user = await jwt(token, strapi);
        const validRoot = await checkAccountRoot(user);
        //Check super admin
        if (validRoot) return data;
        //
        const locationsUser = user?.locations;
        const idLocationParent = locationsUser[0].id;
        const dataRes = [];
        //   console.log(data);
        data.forEach((item) => {
            const locations = item?.locations || [];
            if (idLocationParent == locations[0].id) {
                dataRes.push(item);
            }
        });
        return dataRes;
    } catch (error) {
        return error;
    }
}

const roleLocationsData = async (ctx, strapi, data) => {
    try {
        const token = ctx.request.headers.authorization;
        const user = await jwt(token, strapi);
        const validRoot = await checkAccountRoot(user);
        //Check super admin
        if (validRoot) return data;
        //
        const locationsUser = user?.locations;
        const idLocationParent = locationsUser[locationsUser.length - 1].id;
        const dataRes = [];
        //   console.log(data);
        data.forEach((item) => {
            const locations = item?.locations || [];
            locations.forEach((elem, index) => {
                if (idLocationParent == elem.id && locationsUser.length - 1 == index) {
                    dataRes.push(item);
                }
            });
        });
        return dataRes;
    } catch (error) {
        return error;
    }
};

const locationsParent = async (ctx, strapi, data) => {
    const token = ctx.request.headers.authorization;
    const user = await jwt(token, strapi);
    //Check super admin
    const validRoot = await checkAccountRoot(user);
    if (validRoot) return data;
    //
    const locationsUser = user?.locations;
    const idLocationParent = locationsUser[0].id;
    const dataRes = [];
    data.forEach((item) => {
        if (item.id == idLocationParent) {
            dataRes.push(item);
        }
    });

    return dataRes;
};

module.exports = {
    roleLocations,
    roleLocationsCreate,
    roleLocationsMedia,
    roleLocationsDataMedia,
    roleLocationsData,
    locationsParent,
    roleLocationFindPlaylist
};
