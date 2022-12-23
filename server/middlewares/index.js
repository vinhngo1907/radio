'use strict';
const auth = require('../middlewares/auth');
const { authMiddleware } = require("./auth.middleware");

module.exports = {
    auth,
    cors: true,
    authMiddleware
};
