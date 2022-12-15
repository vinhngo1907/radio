const { model, Schema } = require("mongoose");

const ScheduleSchema = new Schema({
    deviceId: String,
    playlistId: String,
    action: Number,
    userCreated: Number,
    playlists: Array
});

const scheduleSchema = model("Schedule", ScheduleSchema);

module.exports = scheduleSchema;