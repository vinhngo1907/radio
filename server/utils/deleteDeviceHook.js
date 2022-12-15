const deviceSocketSchema = require("../models/devices.model");


const deleteDeviceHook = async (data) => {
    const deviceId = data.device_id

    const response = await deviceSocketSchema.deleteMany({
        deviceId
    })

    console.log(response)

}

module.exports = deleteDeviceHook