'use strict';

const jwt = require("./jwt");
const { getPlaylistSampleLocationFromDb, getTimeBlock, getTimeBlockExits } = require('./createCalendar');

const getDataPriority = async (data, all_location) => {
    const device = await strapi.entityService.findMany("plugin::radio.device", {
        filters: {
            $not: {
                publishedAt: null
            },
            locations: data.locations
        },
        populate: {
            locations: {
                fields: ['id']
            }
        }
    })

    const media = await strapi.entityService.findMany("plugin::radio.media", {
        filters: {
            $not: {
                publishedAt: null
            },
            status: 'complete',
            id: data.media
        },
        populate: {
            media: true
        }
    })

    const listDevice = []
    const listMedia = []


    media.forEach(item => {
        if (item.type == 'mp3') {
            const obj = {
                url: process.env.BASE_URL + item.media.url,
                size: Number((item.media.size * 1024).toFixed(0))
            }
            listMedia.push(obj)
        } else {
            const obj = {
                url: item.source,
                size: 0
            }
            listMedia.push(obj)
        }

    })

    if (all_location == true) {
        device.forEach(item => {
            const listLocationDepend = []
            const length = data.locations.length
            for (let i = 0; i < length; i++) {
                if (item.locations[i]?.id) {
                    console.log(item.locations[i].id)
                    listLocationDepend.push(item.locations[i].id)
                }
            }
            console.log(listLocationDepend)
            const locationDevice = []
            item.locations.forEach(elem => locationDevice.push(elem.id))
            if (JSON.stringify(listLocationDepend) == JSON.stringify(data.locations) && locationDevice.length > length) {
                listDevice.push({ deviceId: item.device_id })
            }
        })

    } else {
        device.filter(item => {
            const locationDevice = []
            item.locations.forEach(elem => locationDevice.push(elem.id))
            if (JSON.stringify(locationDevice) == JSON.stringify(data.locations)) {
                listDevice.push({ deviceId: item.device_id })
            }
        })
    }



    const result = {
        playlistId: Math.floor(Math.random() * 50) + 1,
        deviceList: listDevice,
        playlist: listMedia
    }

    return result
}

const getResult = (timeBlockExist, locationUsers) => {
    const allow = []
    for (let i = 0; i < timeBlockExist.length; i++) {
        const locationUserOld = timeBlockExist[i].userCreated
        if (locationUsers.length <= locationUserOld.length) {
            if (locationUsers[i] == locationUserOld[i]) {
                allow.push({ allow: true })
            } else {
                allow.push({ allow: false })
            }
        } else {
            allow.push({ allow: false })
        }
    }

    console.log(allow)

    return allow

}


const checkPriority = async (data) => {

    const user = await jwt(data.token, strapi)

    if (user.locations.length <= 1) {
        return true
    }

    const locationUsers = []

    user.locations.forEach(item => {
        locationUsers.push(item.id)
    })

    const playlists = await getPlaylistSampleLocationFromDb(data, strapi)

    const timeBlock = getTimeBlock(playlists)

    const timeBlockExist = getTimeBlockExits(timeBlock, data.timesTampStart, data.timesTampEnd)

    const result = getResult(timeBlockExist, locationUsers)

    const allow = result.every(item => item.allow == true)

    console.log(allow)

    return allow

}


module.exports = { checkPriority, getDataPriority }