const { model, Schema } = require("mongoose");

const LocationSchema = new Schema({
    deviceId: String(),
    lat: String(),
    lng: String()
});

const locationSchema = model("Location", LocationSchema);
module.exports = locationSchema;