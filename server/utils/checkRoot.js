'use strict';

const { getService } = require("@strapi/plugin-users-permissions/server/utils");
const bcrypt = require("bcrypt");

const checkAccountRoot = async (user) => {
	try {
		// const validRoot = await getService("user").validatePassword(
		// 	process.env.SUPER_ADMIN_SECRET_KEY,
		// 	user.root || ""
		// );
		const validRoot = await bcrypt.compare(process.env.SUPER_ADMIN_SECRET_KEY, user.root);

		return validRoot;
	} catch (error) {
		return error;
	}
};

module.exports = checkAccountRoot;