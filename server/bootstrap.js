'use strict';

const AppDataSource = require("./database");

module.exports = ({ strapi }) => {
  // bootstrap phase
  AppDataSource.initialize().then((data) => {
    console.log("Connect database successfully");
  }).catch(error=>console.log(error));
};
