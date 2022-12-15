const { model, Schema } = require("mongoose");

const DeviceSocketSchema = new Schema({
    deviceId: String(),
    socketId: String(),
    deviceKey: String()
});

const deviceSocketSchema = model("DeviceSocket", DeviceSocketSchema);

module.exports = deviceSocketSchema;