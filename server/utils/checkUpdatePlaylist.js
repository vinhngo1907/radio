const {
    getPlaylistSampleLocationFromDb,
    timeConverter,
    getTimeBlock,
    getTimeBlockExits,
    getTimeBlockExitsEveryDay,
    getScheduleRepeatDateInMonth,
    getTimeBlockExitsRepeatDateAndDay,
    getScheduleRepeatDayInWeek
} = require("./createCalendar");

const getLocation = (locations) => {
    const a = {
        locations: []
    }
    locations.locations.forEach(item => a.locations.push(item.id))

    return a
}

const checkNoRepeat = async (data, locations, params) => {
    try {
        console.log(">>>>>>>>No Repeat")
        // const playlists = await getPlaylistSampleLocationFromDb(getLocation(locations), strapi)
        const playlists = await getPlaylistSampleLocationFromDb(getLocation(locations), strapi, params);
        const { date, time_start, time_end } = data
        const timesTampStart = timeConverter(date, time_start)
        const timesTampEnd = timeConverter(date, time_end)
        const timeBlock = getTimeBlock(playlists)
        const timeBlockExist = getTimeBlockExits(timeBlock, timesTampStart, timesTampEnd)
        console.log(">>>>>>", timeBlockExist)
        if (timeBlockExist.length <= 0) {
            return false
        } else {
            return true
        }
    } catch (error) {
        console.log(error.message)
        return true
    }
}
// const checkRepeatEveryDay = async (data, locations) => {
const checkRepeatEveryDay = async (data, locations, params) => {
    console.log(">>>>>>>>Every Day")
    try {
        const { date, time_start, time_end } = data
        // const playlists = await getPlaylistSampleLocationFromDb(getLocation(locations), strapi)
        const playlists = await getPlaylistSampleLocationFromDb(getLocation(locations), strapi, params);
        const timesTampStart = timeConverter(date, time_start)
        const timesTampEnd = timeConverter(date, time_end)
        const timeBlock = getTimeBlock(playlists)
        const timeBlockExist = getTimeBlockExitsEveryDay(timeBlock, timesTampStart, timesTampEnd)
        if (timeBlockExist.length <= 0) {
            return false
        } else {
            return true
        }
    } catch (error) {
        console.log(error.message)
        return true
    }
}
// const checkRepeatDateInMonth = async (data, locations) => {
const checkRepeatDateInMonth = async (data, locations, params) => {
    console.log(">>>>>>>>Date In Month")
    try {
        const { date, time_start, time_end, repeat_schedule } = data
        // const playlists = await getPlaylistSampleLocationFromDb(getLocation(locations), strapi);
        const playlists = await getPlaylistSampleLocationFromDb(getLocation(locations), strapi, params)
        const timeBlock = getTimeBlock(playlists)
        const scheduleRepeat = getScheduleRepeatDateInMonth(date, time_start, time_end, repeat_schedule[0].schedule)
        const timeBlockExist = getTimeBlockExitsRepeatDateAndDay(timeBlock, scheduleRepeat)
        console.log(">>>>>>", timeBlockExist)
        if (timeBlockExist.length <= 0) {
            return false
        } else {
            return true
        }
    } catch (error) {
        console.log(error.message)
        return true
    }
}
// const checkRepeatDayInWeek = async (data, locations) => {
const checkRepeatDayInWeek = async (data, locations, params) => {
    console.log(">>>>>>>>Repeat Day In Week")
    try {
        const { date, time_start, time_end, repeat_schedule } = data
        // const playlists = await getPlaylistSampleLocationFromDb(getLocation(locations), strapi)
        const playlists = await getPlaylistSampleLocationFromDb(getLocation(locations), strapi, params)
        const timeBlock = getTimeBlock(playlists)
        const scheduleRepeat = getScheduleRepeatDayInWeek(date, time_start, time_end, repeat_schedule[0].schedule)
        const timeBlockExist = getTimeBlockExitsRepeatDateAndDay(timeBlock, scheduleRepeat)
        console.log(">>>>>>", timeBlockExist)
        if (timeBlockExist.length <= 0) {
            return false
        } else {
            return true
        }
    } catch (error) {
        console.log(error.message)
        return true
    }
}

// const checkUpdatePlaylist = async (data, locations, token) => {
const checkUpdatePlaylist = async (data, locations, token, params) => {
    let results
    const { date, repeat, time_start, time_end } = data
    // const user = await jwt(token, strapi)
    // if (user.locations.length <= 1) {
    //     return false
    // } // for user lon nhat
    if (date && repeat && time_start && time_end) {
        switch (repeat) {
            case 'no': {
                // results = await checkNoRepeat(data, locations)
                results = await checkNoRepeat(data, locations, params)
                break
            }
            case 'every_day': {
                // results = await checkRepeatEveryDay(data, locations)
                results = await checkRepeatEveryDay(data, locations, params)
                break
            }
            case 'date_in_month': {
                // results = await checkRepeatDateInMonth(data, locations)
                results = await checkRepeatDateInMonth(data, locations, params)
                break
            }
            case 'day_in_week': {
                // results = await checkRepeatDayInWeek(data, locations)
                results = await checkRepeatDayInWeek(data, locations, params)
                break
            }
        }
    }
    return results
}

module.exports = checkUpdatePlaylist;