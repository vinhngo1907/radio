const repeatEveryday = (repeatSchedule) => {
    const newData = repeatSchedule.map((item, index) => {
        return {
            __component: "type-repeat.repeat-everyday",
            time_start: item.time_start,
            time_end: item.time_end,
        };
    });
    return newData;
};

const repeatDayInWeek = (repeatSchedule) => {
    const newData = repeatSchedule.map((item, index) => {
        return {
            __component: "type-repeat.repeat-day-in-week",
            time_start: item.time_start,
            time_end: item.time_end,
            schedule: item.schedule,
        };
    });
    return newData;
};

const repeatDateInMonth = (repeatSchedule) => {
    const newData = repeatSchedule.map((item, index) => {
        return {
            __component: "type-repeat.repeat-date-in-month",
            time_start: item.time_start,
            time_end: item.time_end,
            schedule: item.schedule,
        };
    });
    return newData;
};

const createPlaylist = async (strapi, data, repeat, resCalendar) => {
    const res = await strapi.entityService.create(
        "plugin::radio.playlist", {
        data: {
            ...data,
            status: "pending",
            repeat_schedule: repeat,
            playlists_exist: resCalendar.resId,
            note: resCalendar.message,
            publishedAt: new Date()
        },
    });
    return res;
};

const updateHaveRepeat = async (request, dataOld, dataNew, strapi, params) => {
    if (request.body.repeat == "no" || request.body.repeat == "every_day") {
        const res = await strapi.entityService.update(
            "plugin::radio.playlist",
            params,
            {
                data: {
                    ...request.body,
                    repeat_schedule: [],
                    publishedAt: new Date()
                },
            }
        );
        return res;
    } else if (request.body.repeat == "day_in_week") {
        const scheduleRepeat = repeatDayInWeek(request.body.repeat_schedule);
        const res = await strapi.entityService.update(
            "plugin::radio.playlist",
            params,
            {
                data: {
                    ...request.body,
                    repeat_schedule: scheduleRepeat,
                    publishedAt: new Date()
                },
            }
        );
        return res;
    } else if (request.body.repeat == "date_in_month") {
        const scheduleRepeat = repeatDateInMonth(request.body.repeat_schedule);
        const res = await strapi.entityService.update(
            "plugin::radio.playlist",
            params,
            {
                data: {
                    ...request.body,
                    repeat_schedule: scheduleRepeat,
                    publishedAt: new Date()
                },
            }
        );
        return res;
    }
};

module.exports =  {
    repeatEveryday,
    repeatDayInWeek,
    repeatDateInMonth,
    createPlaylist,
    updateHaveRepeat,
};
