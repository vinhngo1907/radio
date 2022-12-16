const typeorm = require("typeorm");

const EntitySchema = typeorm.EntitySchema

const DeviceSockets = new EntitySchema({
    name: "DeviceSocket",
    tableName: "devicesockets",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        deviceId: {
            type: "text",
        },
        socketId: { type: 'text' },
        deviceKey: { type: 'text' }
    },
});

module.exports = { DeviceSockets }