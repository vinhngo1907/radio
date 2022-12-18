// const deviceSocketSchema = require("../models/devices.model");
const AppDataSource = require("../database");
const { DeviceSockets } = require("../entities/device.entity");


const deleteDeviceHook = async (data) => {
    const deviceId = data.device_id
    const Entry = await AppDataSource.getRepository(DeviceSockets);
    // const response = await deviceSocketSchema.deleteMany({
    //     deviceId
    // })
    const response = await Entry.delete({ deviceId });
    console.log(response)

}

module.exports = deleteDeviceHook;