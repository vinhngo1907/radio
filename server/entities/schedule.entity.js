const typeorm = require("typeorm");

const EntitySchema = typeorm.EntitySchema;

const Schedule = new EntitySchema({
    name: "Schedule",
    tableName: "schedule",
    columns: {
        id: {
            primary: true,
            type: "uuid",
            generated: true,
        },
        deviceId: {
            type: "character varying",
        },
        playlistId: {
            type: "character varying",
        },
        action: {
            type: "character varying"
        },
        playlists: {
            type: "character varying"
        }
    },
});

module.exports = { Schedule }