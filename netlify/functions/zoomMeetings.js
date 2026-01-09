const axios = require("axios");
const jwt = require("jsonwebtoken");

exports.handler = async () => {
  try {
    // ✅ 1. Create JWT token (expiry must be in SECONDS)
    const token = jwt.sign(
      {
        iss: process.env.ZOOM_API_KEY,
        exp: Math.floor(Date.now() / 1000) + 60, // valid for 1 minute
      },
      process.env.ZOOM_API_SECRET
    );

    // ✅ 2. Call Zoom API
    const meetingsRes = await axios.get(
      `https://api.zoom.us/v2/users/${process.env.ZOOM_USER_ID}/meetings?type=scheduled`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // ✅ 3. Return meetings
    return {
      statusCode: 200,
      body: JSON.stringify(meetingsRes.data.meetings),
    };
  } catch (error) {
    console.error("Zoom API Error:", error.response?.data || error.message);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.response?.data || error.message,
      }),
    };
  }
};
