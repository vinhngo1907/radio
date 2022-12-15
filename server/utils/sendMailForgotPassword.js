const { Novu } = require("@novu/node");
const templateMail = require("./templateMail");

const sendEmalForgotPassword = async (email, pass) => {
    const novu = new Novu("cc31476446244ecf397a5f5c4d59f4df");
    try {
        const response = await novu.trigger('forgot-password', {
            to: {
                subscriberId: "zdpxm9S28E3m",
                email,  // email nhận 
            },
            payload: {
                template: templateMail(pass),
            },
        });
        return {
            status: 200,
            message: response.data
        }
    } catch (error) {
        return {
            status: 400,
            message: error.message
        }
    }
}

module.exports = sendEmalForgotPassword;
