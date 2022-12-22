// interface TypeScheduleDateInMonth {
//     month: number,
//     date: number[]
// }

// interface TypeScheduleDaiInWeek {
//     month: number[],
//     day: number[]
// }

// interface TypeResult {
//     message: string,
//     status: number,
//     resId: number[]

// }

function getSetting(strapi) {
    const response = strapi.entityService.findMany("plugin::radio.setting", {
        fields: ["allow_create_exist_playlist"]
    })
    return response
}


function formatTimeByTimeZone(date) {
    // const d = new Date();
    // const timeZone = d.getTimezoneOffset();

    // return date.getTime() + timeZone * 60 * 1000;
    return date.getTime()
}

const timeConverter = (date_start, time_start, type = 'no') => {
    const year = new Date(date_start * 1000).getFullYear();
    const month = new Date(date_start * 1000).getMonth();
    let day = new Date(date_start * 1000).getUTCDate();
    if (type == 'every_day') day = new Date(date_start * 1000).getDate() + 1;
    const hours = new Date(time_start * 1000).getHours();
    const minute = new Date(time_start * 1000).getMinutes();
    const date = new Date(year, month, day, hours, minute);

    return formatTimeByTimeZone(date);
};

const getHours = (time) => {
    const options = {
        timeZone: 'Asia/Ho_Chi_Minh'
    }
    const d = new Date(time).toLocaleString('vi-VN', options).split(":")
    const hours = Number(d[0])

    return hours
}

const getMinute = (time) => {
    const options = {
        timeZone: 'Asia/Ho_Chi_Minh'
    }
    const d = new Date(time).toLocaleString('vi-VN', options).split(":")
    const minute = Number(d[1])
    return minute
}


const query = {
    filters: {
        $not: {
            publishedAt: null,
        },
        status: 'complete',
        locations: [],
    },
    populate: {
        locations: {
            fields: ["id"]
        },
        user_created: {
            fields: ["id"],
            populate: {
                locations: {
                    fields: ["id"]
                }
            }
        },
        repeat_schedule: true
    }
}

const getScheduleRepeatDateInMonth = (date, start, end, schedule) => {
    const scheduleRepeat = [];

    const repeat_start_hours_int = new Date(start * 1000).getUTCHours();
    const repeat_start_min_int = new Date(start * 1000).getUTCMinutes();
    const repeat_end_hours_int = new Date(end * 1000).getUTCHours();
    const repeat_end_min_int = new Date(end * 1000).getUTCMinutes();
    const current_year = new Date().getUTCFullYear();

    for (let index = 0; index < schedule.length; index++) {
        const current_month = Number(schedule[index].month) - 1;
        const current_day_arr = schedule[index].date;
        for (let j = 0; j < current_day_arr.length; j++) {
            const current_date = Number(current_day_arr[j]);
            const current_time_start = new Date(
                current_year,
                current_month,
                current_date,
                repeat_start_hours_int,
                repeat_start_min_int
            );
            const current_time_end = new Date(
                current_year,
                current_month,
                current_date,
                repeat_end_hours_int,
                repeat_end_min_int
            );
            const current_timestamp_start = formatTimeByTimeZone(current_time_start);
            const current_timestamp_end = formatTimeByTimeZone(current_time_end);

            const type_item = {
                timesTampStart: current_timestamp_start,
                timesTampEnd: current_timestamp_end,
            };
            scheduleRepeat.push(type_item);
        }
    }

    const first_date = new Date(date * 1000).getUTCDate()
    const first_month = new Date(date * 1000).getUTCMonth()

    const first_playlist_start = formatTimeByTimeZone(new Date(current_year, first_month, first_date, repeat_start_hours_int,
        repeat_start_min_int))

    const first_playlist_end = formatTimeByTimeZone(new Date(current_year, first_month, first_date, repeat_end_hours_int,
        repeat_end_min_int))

    const first_playlits = {
        timesTampStart: first_playlist_start,
        timesTampEnd: first_playlist_end,
    }

    scheduleRepeat.push(first_playlits)

    return scheduleRepeat;

}

function getFirstDayInWeek(month, day) {
    const d = new Date();
    d.setMonth(month);
    let found = false;
    let date = 1;
    while (!found) {
        d.setDate(date);
        if (d.getDay() == day) {
            found = true;
            return d.getDate();
        }
        date++;
    }

    return undefined;
}

const getScheduleRepeatDayInWeek = (date, start, end, schedule) => {
    const scheduleRepeat = [];
    const repeat_start_hours_int = new Date(start * 1000).getUTCHours();
    const repeat_start_min_int = new Date(start * 1000).getUTCMinutes();
    const repeat_end_hours_int = new Date(end * 1000).getUTCHours();
    const repeat_end_min_int = new Date(end * 1000).getUTCMinutes();
    const current_year = new Date().getUTCFullYear();
    const repeat_month = schedule.month
    const repeat_day = schedule.day

    for (let month_index = 0; month_index < repeat_month.length; month_index++) {
        //     //get month
        const current_month = Number(repeat_month[month_index]) - 1;
        for (let day_index = 0; day_index < repeat_day.length; day_index++) {
            //        //get day
            const current_day = Number(repeat_day[day_index]) - 1;
            const current_time_start = new Date(
                current_year,
                current_month,
                getFirstDayInWeek(current_month, current_day),
                repeat_start_hours_int,
                repeat_start_min_int
            );
            const current_time_end = new Date(
                current_year,
                current_month,
                getFirstDayInWeek(current_month, current_day),
                repeat_end_hours_int,
                repeat_end_min_int
            );
            const current_timestamp_start = formatTimeByTimeZone(current_time_start);
            const current_timestamp_end = formatTimeByTimeZone(current_time_end);
            const type_item = {
                timesTampStart: current_timestamp_start,
                timesTampEnd: current_timestamp_end,
            };
            scheduleRepeat.push(type_item);
        }
    }
    const first_date = new Date(date * 1000).getUTCDate()
    const first_month = new Date(date * 1000).getUTCMonth()

    const first_playlist_start = formatTimeByTimeZone(new Date(current_year, first_month, first_date, repeat_start_hours_int,
        repeat_start_min_int))

    const first_playlist_end = formatTimeByTimeZone(new Date(current_year, first_month, first_date, repeat_end_hours_int,
        repeat_end_min_int))

    const first_playlits = {
        timesTampStart: first_playlist_start,
        timesTampEnd: first_playlist_end,
    }

    scheduleRepeat.push(first_playlits)
    return scheduleRepeat;
}

const getLocationCreating = (user) => {
    const locations = []

    user.locations.forEach(item => locations.push(item.id))

    return locations
}

// interface TypeTimeBlock {
//     playlistId: number,
//     repeat: string,
//     userCreated: number[],
//     timeStart: number,
//     timeEnd: number
// }

const getTimeBlock = (playlists) => {
    const timeBlock = []
    playlists.forEach(playlist => {
        let locations = []
        const { date, time_start, time_end, user_created, repeat_schedule } = playlist
        user_created.locations.forEach(item => locations.push(item.id))
        const obj = {
            playlistId: playlist.id,
            repeat: playlist.repeat,
            userCreated: locations,
            timeStart: timeConverter(date, time_start),
            timeEnd: timeConverter(date, time_end)
        }
        if (playlist.repeat == 'date_in_month') {
            const timeBlockRepeat = getScheduleRepeatDateInMonth(date, time_start, time_end, repeat_schedule[0].schedule)
            timeBlockRepeat.forEach(item => timeBlock.push({
                playlistId: playlist.id,
                repeat: playlist.repeat,
                userCreated: locations,
                timeStart: item.timesTampStart,
                timeEnd: item.timesTampEnd
            }))
        }
        if (playlist.repeat == 'day_in_week') {
            const timeBlockRepeat = getScheduleRepeatDayInWeek(date, time_start, time_end, repeat_schedule[0].schedule)
            timeBlockRepeat.forEach(item => timeBlock.push({
                playlistId: playlist.id,
                repeat: playlist.repeat,
                userCreated: locations,
                timeStart: item.timesTampStart,
                timeEnd: item.timesTampEnd
            }))
        }
        timeBlock.push(obj)
    })

    return timeBlock
}


const getTimeBlockExits = (timeBlock, timesTampStart, timesTampEnd) => {
    const timeBlockExist = []
    for (let i = 0; i < timeBlock.length; i++) {
        const start = timeBlock[i].timeStart <= timesTampStart && timesTampStart <= timeBlock[i].timeEnd
        const end = timeBlock[i].timeStart <= timesTampEnd && timesTampEnd <= timeBlock[i].timeEnd
        if (start || end) {
            if (timeBlockExist.length >= 1 && timeBlockExist[timeBlockExist.length - 1].playlistId != timeBlock[i].playlistId) {
                timeBlockExist.push(timeBlock[i])
            }
            if (timeBlockExist.length == 0) {
                timeBlockExist.push(timeBlock[i])
            }
        }
    }

    return timeBlockExist
}



const getTimeBlockExitsEveryDay = (timeBlock, timesTampStart, timesTampEnd) => {
    const timeStart =
        formatTimeByTimeZone(new Date(1999, 10 - 1, 22, getHours(timesTampStart), getMinute(timesTampStart)))
    const timeEnd =
        formatTimeByTimeZone(new Date(1999, 10 - 1, 22, getHours(timesTampEnd), getMinute(timesTampEnd)))
    const timeBlockExist = []
    for (let i = 0; i < timeBlock.length; i++) {
        const blockStart = formatTimeByTimeZone(new Date(1999, 10 - 1, 22, getHours(timeBlock[i].timeStart), getMinute(timeBlock[i].timeStart)))
        const blockEnd = formatTimeByTimeZone(new Date(1999, 10 - 1, 22, getHours(timeBlock[i].timeEnd), getMinute(timeBlock[i].timeEnd)))

        const start = blockStart <= timeStart && timeStart <= blockEnd
        const end = blockStart <= timeEnd && timeEnd <= blockEnd

        if (start || end) {
            if (timeBlockExist.length >= 1 && timeBlockExist[timeBlockExist.length - 1].playlistId != timeBlock[i].playlistId) {
                timeBlockExist.push(timeBlock[i])
            }
            if (timeBlockExist.length == 0) {
                timeBlockExist.push(timeBlock[i])
            }
        }
    }

    console.log(timeBlockExist)

    return timeBlockExist
}

const getTimeBlockExitsRepeatDateAndDay = (timeBlock, scheduleRepeat) => {
    const timeBlockExist = []
    // console.log(">>>> Schedule Repeat", scheduleRepeat)
    // console.log(">>>> TimeBlock Exits", timeBlock)
    for (let i = 0; i < timeBlock.length; i++) {
        for (let j = 0; j < scheduleRepeat.length; j++) {
            if (timeBlock[i].repeat == 'every_day') {
                const timeStartBlock =
                    formatTimeByTimeZone(new Date(1999, 10 - 1, 22, getHours(timeBlock[i].timeStart), getMinute(timeBlock[i].timeStart)))
                const timeEndBlock =
                    formatTimeByTimeZone(new Date(1999, 10 - 1, 22, getHours(timeBlock[i].timeEnd), getMinute(timeBlock[i].timeEnd)))
                const timeStartSchedule = formatTimeByTimeZone(new Date(1999, 10 - 1, 22, getHours(scheduleRepeat[j].timesTampStart), getMinute(scheduleRepeat[j].timesTampStart)))
                const timeEndSchedule = formatTimeByTimeZone(new Date(1999, 10 - 1, 22, getHours(scheduleRepeat[j].timesTampEnd), getMinute(scheduleRepeat[j].timesTampEnd)))
                const start = timeStartBlock <= timeStartSchedule && timeStartSchedule <= timeEndBlock
                const end = timeStartBlock <= timeEndSchedule && timeEndSchedule <= timeEndBlock
                if (start || end) {
                    if (timeBlockExist.length >= 1 && timeBlockExist[timeBlockExist.length - 1].playlistId != timeBlock[i].playlistId) {
                        timeBlockExist.push(timeBlock[i])
                        break
                    }
                    if (timeBlockExist.length == 0) {
                        timeBlockExist.push(timeBlock[i])
                        break
                    }
                }
            } else {
                const timeStartBlock = timeBlock[i].timeStart;
                const timeEndBlock = timeBlock[i].timeEnd;
                const timeStartSchedule = scheduleRepeat[j].timesTampStart;
                const timeEndSchedule = scheduleRepeat[j].timesTampEnd
                const start = timeStartBlock <= timeStartSchedule && timeStartSchedule <= timeEndBlock
                const end = timeStartBlock <= timeEndSchedule && timeEndSchedule <= timeEndBlock

                console.log(start, timeStartBlock, timeStartSchedule)
                console.log(end, timeEndBlock, timeEndSchedule)
                if (start || end) {
                    if (timeBlockExist.length >= 1 && timeBlockExist[timeBlockExist.length - 1].playlistId == timeBlock[i].playlistId) {
                        timeBlockExist.push(timeBlock[i])
                    }
                    if (timeBlockExist.length == 0) {
                        timeBlockExist.push(timeBlock[i])
                    }
                }
            }
        }
    }
    console.log(timeBlockExist)

    return timeBlockExist
}


const createPlaylistExist = (timeBlockExist) => {
    const resId = []
    timeBlockExist.forEach(item => resId.push(item.playlistId))
    return resId
}


const getResults = async (timeBlockExist, locationUserCreating, setting, strapi) => {

    const result = {
        status: 200,
        message: 'No',
        resId: []
    }

    if (timeBlockExist.length < 1) {
        result.status = 200;
        result.message = 'no';
        result.resId = [];
        return result
    }
    if (setting.allow_create_exist_playlist == 'allow') { // have warning
        if (locationUserCreating.length > 1) {
            const resId = createPlaylistExist(timeBlockExist)
            result.status = 200;
            result.message = 'yes';
            result.resId = resId;
            return result
        } else {
            const resId = createPlaylistExist(timeBlockExist)
            result.status = 200;
            result.message = 'no';
            result.resId = resId;
            return result
        }
    } else {
        if (locationUserCreating.length <= 1) {
            const resId = createPlaylistExist(timeBlockExist)
            result.status = 200;
            result.message = 'no';
            result.resId = resId;
            return result
        } else {
            let allow = true
            for (let i = 0; i < timeBlockExist.length; i++) {
                if (timeBlockExist[i].userCreated.length <= locationUserCreating.length) {
                    allow = false
                    break
                }
            }
            if (allow) {
                const resId = createPlaylistExist(timeBlockExist)
                result.status = 200;
                result.message = 'no';
                result.resId = resId;
                return result
            } else {
                result.status = 409;
                result.message = 'Have are playlits exits, you not allow create playlist';
                result.resId = [];
                return result
            }
        }
    }
}

const getPlaylistSampleLocationFromDb = async (data, strapi, params = null) => {
    const locations = data.locations

    query.filters.locations = locations

    const playlistsQuery = await strapi.entityService.findMany("plugin::radio.playlist", { ...query })

    if (data.all_location == true) {
        const playlists = playlistsQuery.filter(item => {
            const length = locations.length
            const a = []
            for (let i = 0; i < length; i++) {
                if (item.locations[i]?.id != undefined) {
                    a.push(item.locations[i].id)
                }
            }
            const b = []
            item.locations.forEach(elem => b.push(elem.id))
            return JSON.stringify(locations) == JSON.stringify(a) && item.id != params && b.length > locations.length
        })
        console.log(">>>>>>>>Playlits all locations", playlists)
        return playlists
    }

    const playlists = playlistsQuery.filter(item => {
        const a = []
        item.locations.forEach(elem => a.push(elem.id))
        return JSON.stringify(locations) == JSON.stringify(a) && item.id != params
    })

    console.log(">>>>>>>>Playlits no all locations", playlists)

    return playlists
}


const checkNoRepeat = async (data, strapi, user, setting) => {

    try {
        console.log(">>>>>>>>No Repeat")
        const playlists = await getPlaylistSampleLocationFromDb(data, strapi)

        const { date, time_start, time_end } = data

        const timesTampStart = timeConverter(date, time_start)

        const timesTampEnd = timeConverter(date, time_end)

        const timeBlock = getTimeBlock(playlists)

        const locationUserCreating = getLocationCreating(user)

        const timeBlockExist = getTimeBlockExits(timeBlock, timesTampStart, timesTampEnd)
        console.log(">>>>>>", timeBlockExist)
        const result = await getResults(timeBlockExist, locationUserCreating, setting, strapi)

        return result
    } catch (error) {
        return {
            message: error.message,
            status: 404,
            resId: []
        }
    }
}

const checkRepeatEveryDay = async (data, strapi, user, setting) => {
    try {
        console.log(">>>>>>>>Repeat Every Day")
        const { date, time_start, time_end } = data
        const playlists = await getPlaylistSampleLocationFromDb(data, strapi)
        const timesTampStart = timeConverter(date, time_start)
        const timesTampEnd = timeConverter(date, time_end)
        const timeBlock = getTimeBlock(playlists)
        const locationUserCreating = getLocationCreating(user)
        const timeBlockExist = getTimeBlockExitsEveryDay(timeBlock, timesTampStart, timesTampEnd)

        const result = await getResults(timeBlockExist, locationUserCreating, setting, strapi)
        return result
    } catch (error) {
        return {
            message: error.message,
            status: 404,
            resId: []
        }
    }
}

const checkRepeatDateInMonth = async (data, strapi, user, setting) => {
    try {
        console.log(">>>>>>>>Repeat Date In Month")
        const { date, time_start, time_end, repeat_schedule } = data
        const playlists = await getPlaylistSampleLocationFromDb(data, strapi)
        const timeBlock = getTimeBlock(playlists)
        const scheduleRepeat = getScheduleRepeatDateInMonth(date, time_start, time_end, repeat_schedule[0].schedule)
        const locationUserCreating = getLocationCreating(user)
        const timeBlockExist = getTimeBlockExitsRepeatDateAndDay(timeBlock, scheduleRepeat)
        console.log(">>>>>>", timeBlockExist)
        const result = await getResults(timeBlockExist, locationUserCreating, setting, strapi)
        return result
    } catch (error) {
        return {
            message: error.message,
            status: 404,
            resId: []
        }
    }
}
const checkRepeatDayInWeek = async (data, strapi, user, setting) => {
    try {
        console.log(">>>>>>>>Repeat Day In Week")
        const { date, time_start, time_end, repeat_schedule } = data
        const playlists = await getPlaylistSampleLocationFromDb(data, strapi)
        const timeBlock = getTimeBlock(playlists)
        const scheduleRepeat = getScheduleRepeatDayInWeek(date, time_start, time_end, repeat_schedule[0].schedule)
        const locationUserCreating = getLocationCreating(user)
        const timeBlockExist = getTimeBlockExitsRepeatDateAndDay(timeBlock, scheduleRepeat)
        console.log(">>>>>>", timeBlockExist)
        const result = await getResults(timeBlockExist, locationUserCreating, setting, strapi)
        return result
    } catch (error) {
        return {
            message: error.message,
            status: 404,
            resId: []
        }
    }
}


const checkCalendarUser = async (data, user, strapi) => {
    let results;

    const setting = await getSetting(strapi)
    switch (data.repeat) {
        case 'no': {
            results = await checkNoRepeat(data, strapi, user, setting)
            break
        }
        case 'every_day': {
            results = await checkRepeatEveryDay(data, strapi, user, setting)
            break
        }
        case 'date_in_month': {
            results = await checkRepeatDateInMonth(data, strapi, user, setting)
            break
        }
        case 'day_in_week': {
            results = await checkRepeatDayInWeek(data, strapi, user, setting)
            break
        }
    }
    return results
}

module.exports = {
    checkCalendarUser, getPlaylistSampleLocationFromDb, timeConverter, getTimeBlock, getTimeBlockExits, getTimeBlockExitsEveryDay, getScheduleRepeatDateInMonth, getTimeBlockExitsRepeatDateAndDay, getScheduleRepeatDayInWeek
}