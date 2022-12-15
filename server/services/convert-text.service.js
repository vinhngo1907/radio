/**
 * convert-text service
 */

const { Strapi } = require("@strapi/strapi");
const Docxtemplater = require("docxtemplater");
const PizZip = require("pizzip");
const fs = require("fs");
const path = require("path");

module.exports = ({ strapi }) => ({
    async update(ctx) {
        try {
            const { request } = ctx;
            const fileRequest = request.files.files;
            console.log(fileRequest)
            const contentBuffer = await fs.readFileSync(
                path.resolve(fileRequest.path),
                "binary"
            );
            const docs = new Docxtemplater(new PizZip(contentBuffer));
            return {
                content: docs.getFullText(),
            };
        } catch (error) {
            ctx.send({ message: error.message }, 400);
        }
    },
})