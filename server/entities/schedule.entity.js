const typeorm = require("typeorm");

const EntitySchema = typeorm.EntitySchema;

const Schedule = new EntitySchema({
    name: "Schedule",
    tableName: "schedules",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        deviceId: {
            type: "text",
        },
        playlistId: {
            type: "text",
        },
        action: {
            type: "text"
        },
        playlists: {
            type: "text"
        }
    },
});

module.exports = { Schedule }