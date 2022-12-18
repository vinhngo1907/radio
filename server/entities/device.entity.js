const typeorm = require("typeorm");

const EntitySchema = typeorm.EntitySchema

const DeviceSockets = new EntitySchema({
    name: "DeviceSocket",
    tableName: "devicesockets",
    columns: {
        id: {
            primary: true,
            type: "uuid",
            generated: true,

        },
        deviceId: {
            type: "character varying",
        },
        socketId: { type: 'character varying' },
        deviceKey: { type: 'character varying' }
    },
});

module.exports = { DeviceSockets }