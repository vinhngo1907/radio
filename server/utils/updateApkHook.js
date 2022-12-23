"use strict";

const axios = require("axios");
const { populate } = require("../models/schedule.model");

const updateApkHook = async (data, ctx) => {
    try {
        const token = ctx.request.headers.authorization;

        const apk = await strapi.db.query('plugin::radio.updateapk').findOne({
            where: {
                id: data.id
            },
            populate: ["file", "locations"]
        })
        const url = apk.file.url
        const device = await strapi.db.query('plugin::radio.device').findMany({
            where: {
                $not: {
                    publishedAt: null
                }
            },
            populate: ["locations"]
        })
        const listDeviceId = []

        if (apk.all_location == true) {
            device.forEach(item => listDeviceId.push({ deviceId: item.device_id }))
        } else {
            const locations = []
            apk.locations.forEach(item => locations.push(item.id))
            device.forEach(item => {
                const locationsDevice = []
                item.locations.forEach(item => locationsDevice.push(item.id))
                if (JSON.stringify(locationsDevice) == JSON.stringify(locations)) {
                    listDeviceId.push({ deviceId: item.device_id })
                }
            })
        }

        const dataSubmit = {
            listDevices: listDeviceId,
            apkUrl: `${process.env.BASE_URL}${url}`,
            version: data.version
        }

        console.log(dataSubmit)

        const response = await axios.post(`${process.env.URL_BASE_SOCKET}/api/v1/apk/update-apk`, dataSubmit, {
            headers: {
                Authorization: token,
            },
        })

        console.log(response)

        return response

    } catch (error) {
        console.log(error)
        return error
    }

}

module.exports = { updateApkHook }