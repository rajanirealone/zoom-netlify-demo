const axios = require("axios");
const jwt = require("jsonwebtoken");

exports.handler = async () => {
  try {
    const token = jwt.sign(
      {
        iss: process.env.ZOOM_API_KEY,
        exp: Math.floor(Date.now() / 1000) + 60,
      },
      process.env.ZOOM_API_SECRET
    );

    const meetingsRes = await axios.get(
      `https://api.zoom.us/v2/users/${process.env.ZOOM_USER_ID}/meetings?type=scheduled`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify(meetingsRes.data.meetings),
    };
  } catch (error) {
    // 🔥 IMPORTANT: return the real Zoom error
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Zoom API failed",
        zoomError: error.response?.data || error.message,
      }),
    };
  }
};
