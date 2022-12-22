const typeorm = require("typeorm");

const EntitySchema = typeorm.EntitySchema;

const Locations = new EntitySchema({
    name: "Location",
    tableName: "locations",
    columns: {
        id: {
            primary: true,
            type: "uuid",
            generated: "uuid"
        },
        deviceId: {
            type: "character varying",
        },
        lat: { type: "character varying" },
        lng: { type: "character varying" }
    },
});

module.exports = { Locations }