'use strict';

const user = require("./user");
const capacity = require("./capacity");
const rolesupport = require("./role-support");
const location = require("./location");
const device = require("./device");
const media = require("./media");
const setting = require("./setting");
const converttext = require("./convert-text");
const playlist = require("./playlist");
const playpriority = require("./play-priority");
const updateapk = require("./update-apk");
const texttospeedcallback = require("./text-to-speed-callback");
const playlistexist = require("./playlist-exist");

module.exports = {
    user,
    setting,
    capacity,
    rolesupport,
    location,
    device,
    media,
    setting,
    converttext,
    playlist,
    playpriority,
    updateapk,
    texttospeedcallback,
    playlistexist
};
