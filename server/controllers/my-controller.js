'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('radio')
      .service('myService')
      .getWelcomeMessage();
  },
});
