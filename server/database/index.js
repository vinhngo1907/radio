const { DataSource } = require("typeorm");
const { DeviceSockets } = require("../entities/device.entity");
const { Locations } = require("../entities/location.entity");
const { Schedule } = require("../entities/schedule.entity");

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.HOST_SOCKET || 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5433'),
    username: process.env.BD_USER ?? "yugabyte",
    password: process.env.DB_PASS ?? "yugabyte",
    database: "socket",
    synchronize: true,
    entities: [
        DeviceSockets,
        Locations,
        Schedule,
    ],
});

module.exports = AppDataSource;