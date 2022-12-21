'use strict';

const myController = require('./my-controller');
const userController = require('./user.controller');
const actionPasswordController = require('./action-password.controller');
const roleSupportController = require('./role-support.controller');
const capacitiesController = require('./capacities.controller');
const locationController = require('./location.controller');
const deviceController = require('./device.controller');
const settingController = require('./setting.controller');
const apkController = require('./apk.controller');
const textToSpeechCallbackController = require('./text-to-speech-callback.controller');
const convertTextController = require('./convert-text.controller');
const mediaController = require('./media.controller');
const playlistController = require('./playlist.controller');
const authController = require("./auth.controller");

module.exports = {
  myController,
  userController,
  actionPasswordController,
  roleSupportController,
  capacitiesController,
  locationController,
  deviceController,
  settingController,
  apkController,
  textToSpeechCallbackController,
  convertTextController,
  mediaController,
  playlistController,
  authController
};
