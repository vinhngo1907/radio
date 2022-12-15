const axios = require("axios");

const TextToSpeech = async (dataMedia) => {
	try {
		const { type, input_text, description, voice_code, speed_rate, name } =
			dataMedia;
		const setting = await strapi.entityService.findMany("plugin::radio.setting");

		const { vbee_token, vbee_app_id } = setting;
		const dataSubmitVbee = {
			app_id: vbee_app_id,
			callback_url: process.env.CALLBACK_URL_VBEE,
			input_text,
			voice_code,
			audio_type: "mp3",
			bitrate: 128,
			speed_rate,
		};
		const response = await axios.post(
			"https://vbee.vn/api/v1/tts",
			dataSubmitVbee,
			{
				headers: {
					Authorization: `Bearer ${vbee_token}`,
				},
			}
		);

		// console.log(response.data);

		return {
			request_id: response.data.result.request_id,
			message: "Successfully",
			status: 200,
		};
	} catch (error) {
		console.log(error);
		return {
			message: error.message,
			status: 400,
		};
	}
};

module.exports = TextToSpeech;
