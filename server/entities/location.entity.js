const typeorm = require("typeorm");

const EntitySchema = typeorm.EntitySchema;

const Locations = new EntitySchema({
    name: "Location",
    tableName: "locations",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        deviceId: {
            type: "text",
        },
        lat: { type: "text" },
        lng: { type: "text" }
    },
});

module.exports = { Locations }