'use strict';

const myService = require('./my-service');
const userService = require('./user.service');
const actionPasswordService = require('./action-password.service');
const roleSupportService = require('./role-support.service');
const capacitiesService = require('./capacities.service');
const locationService = require('./location.service');
const deviceService = require('./device.service');
const settingService = require('./setting.service');
const apkService = require('./apk.service');
const textToSpeechCallbackService = require('./text-to-speech-callback.service');
const convertTextService = require('./convert-text.service');
const mediaService = require('./media.service');
const playlistService = require('./playlist.service');

module.exports = {
  myService,
  userService,
  actionPasswordService,
  roleSupportService,
  capacitiesService,
  locationService,
  deviceService,
  settingService,
  apkService,
  textToSpeechCallbackService,
  convertTextService,
  mediaService,
  playlistService
};
